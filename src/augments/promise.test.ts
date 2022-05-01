import {assertInstanceOf} from './jest-only/jest';
import {
    createDeferredPromiseWrapper,
    isPromiseLike,
    PromiseTimeoutError,
    wait,
    wrapPromiseInTimeout,
} from './promise';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelayMs = 500;

describe(createDeferredPromiseWrapper.name, () => {
    it(
        'should create a promise which can be resolved externally.',
        async () => {
            expect.assertions(1);
            const resolveValue = Math.random();

            const deferredPromise = createDeferredPromiseWrapper<number>();
            setTimeout(() => {
                deferredPromise.resolve(resolveValue);
            }, promiseDelayMs);

            expect(await deferredPromise.promise).toBe(resolveValue);
        },
        promiseDelayMs * 2,
    );

    it(
        'should create a promise that can be rejected externally.',
        async () => {
            expect.assertions(1);
            const message = 'this was rejected internally';
            const deferredPromise = createDeferredPromiseWrapper<number>();
            setTimeout(() => {
                deferredPromise.reject(message);
            }, promiseDelayMs);

            await expect(deferredPromise.promise).rejects.toEqual(message);
        },
        promiseDelayMs * 2,
    );
});

describe(wait.name, () => {
    it(
        'should create a promise which can be resolved externally.',
        async () => {
            expect.assertions(1);
            const startTime = Date.now();

            const delayPromise = wait(promiseDelayMs);

            await delayPromise;

            const endTime = Date.now();

            expect(endTime - startTime).toBeGreaterThanOrEqual(promiseDelayMs);
        },
        promiseDelayMs * 2,
    );
});

describe(wrapPromiseInTimeout.name, () => {
    it(
        'should not reject a promise when it is resolved in time',
        async () => {
            expect.assertions(2);
            const startTime = Date.now();
            const deferredPromiseWrapper = createDeferredPromiseWrapper<number>();
            const promiseWithTimeout = wrapPromiseInTimeout(
                promiseDelayMs,
                deferredPromiseWrapper.promise,
            );

            const resolutionValue: number = Math.random();

            deferredPromiseWrapper.resolve(resolutionValue);

            expect(await promiseWithTimeout).toEqual(resolutionValue);
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThanOrEqual(promiseDelayMs);
        },
        promiseDelayMs * 2,
    );

    it(
        'should reject when the promise is not resolved in time',
        async () => {
            expect.assertions(4);
            const startTime = Date.now();
            const deferredPromiseWrapper = createDeferredPromiseWrapper<number>();
            const promiseWithTimeout = wrapPromiseInTimeout(
                promiseDelayMs,
                deferredPromiseWrapper.promise,
            );

            await expect(promiseWithTimeout).rejects.toBeInstanceOf(PromiseTimeoutError);
            let timeoutError;
            try {
                await promiseWithTimeout;
            } catch (internalError) {
                timeoutError = internalError;
            }

            assertInstanceOf(timeoutError, PromiseTimeoutError);
            expect(timeoutError.message).toEqual(`Promised timed out after ${promiseDelayMs} ms.`);
            const endTime = Date.now();
            expect(endTime - startTime).toBeGreaterThanOrEqual(promiseDelayMs);
        },
        promiseDelayMs * 2,
    );
});

describe(isPromiseLike.name, () => {
    it('should work', async () => {
        const waiting = wait(400);
        expect(isPromiseLike(waiting)).toBe(true);
        const awaited = await waiting;
        expect(isPromiseLike(awaited)).toBe(false);
    });
});
