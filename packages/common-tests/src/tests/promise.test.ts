import {typedAssertInstanceOf} from '@augment-vir/testing';
import chai, {assert, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {describe, it} from 'mocha';
import {
    createDeferredPromiseWrapper,
    isPromiseLike,
    PromiseTimeoutError,
    wait,
    wrapPromiseInTimeout,
} from '../../../common/src';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelayMs = 500;

describe(createDeferredPromiseWrapper.name, () => {
    it('should create a promise which can be resolved externally.', async () => {
        // expect.assertions(1);
        const resolveValue = Math.random();

        const deferredPromise = createDeferredPromiseWrapper<number>();
        setTimeout(() => {
            deferredPromise.resolve(resolveValue);
        }, promiseDelayMs);

        expect(await deferredPromise.promise).to.equal(resolveValue);
    });
    // promiseDelayMs * 2,

    it('should create a promise that can be rejected externally.', async () => {
        // expect.assertions(1);
        const message = 'this was rejected internally';
        const deferredPromise = createDeferredPromiseWrapper<number>();
        setTimeout(() => {
            deferredPromise.reject(message);
        }, promiseDelayMs);

        chai.use(chaiAsPromised);
        await expect(deferredPromise.promise).to.be.rejectedWith(message);
    });
    // promiseDelayMs * 2,
});

describe(wait.name, () => {
    it('should create a promise which can be resolved externally.', async () => {
        // expect.assertions(1);
        const startTime = Date.now();

        const delayPromise = wait(promiseDelayMs);

        await delayPromise;

        const endTime = Date.now();

        expect(endTime - startTime).to.be.greaterThanOrEqual(promiseDelayMs);
    });
    // promiseDelayMs * 2,
});

describe(wrapPromiseInTimeout.name, () => {
    it('should not reject a promise when it is resolved in time', async () => {
        // expect.assertions(2);
        const startTime = Date.now();
        const deferredPromiseWrapper = createDeferredPromiseWrapper<number>();
        const promiseWithTimeout = wrapPromiseInTimeout(
            promiseDelayMs,
            deferredPromiseWrapper.promise,
        );

        const resolutionValue: number = Math.random();

        deferredPromiseWrapper.resolve(resolutionValue);

        expect(await promiseWithTimeout).to.equal(resolutionValue);
        const endTime = Date.now();
        expect(endTime - startTime).to.be.lessThanOrEqual(promiseDelayMs);
    });
    // promiseDelayMs * 2,

    it('should reject when the promise is not resolved in time', async () => {
        // expect.assertions(4);
        const startTime = Date.now();
        const deferredPromiseWrapper = createDeferredPromiseWrapper<number>();
        const promiseWithTimeout = wrapPromiseInTimeout(
            promiseDelayMs,
            deferredPromiseWrapper.promise,
        );

        chai.use(chaiAsPromised);
        await expect(promiseWithTimeout).to.be.rejectedWith(PromiseTimeoutError);
        let timeoutError;
        try {
            await promiseWithTimeout;
        } catch (internalError) {
            timeoutError = internalError;
        }

        typedAssertInstanceOf(assert, timeoutError, PromiseTimeoutError);
        expect(timeoutError.message).to.equal(`Promised timed out after ${promiseDelayMs} ms.`);
        const endTime = Date.now();
        expect(endTime - startTime).to.be.greaterThanOrEqual(
            promiseDelayMs -
                // small buffer
                10,
        );
    });
    // promiseDelayMs * 2,
});

describe(isPromiseLike.name, () => {
    it('should work', async () => {
        const waiting = wait(400);
        expect(isPromiseLike(waiting)).to.equal(true);
        const awaited = await waiting;
        expect(isPromiseLike(awaited)).to.equal(false);
    });
});
