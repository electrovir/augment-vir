import {assertThrows, assertTypeOf} from '@augment-vir/chai';
import {
    MaybePromise,
    PromiseTimeoutError,
    createDeferredPromiseWrapper,
    isPromiseLike,
    wait,
    waitForCondition,
    wrapPromiseInTimeout,
} from '@augment-vir/common';
import {randomString} from '@augment-vir/node-js';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {assertInstanceOf} from 'run-time-assertions';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelayMs = 500;

describe(createDeferredPromiseWrapper.name, () => {
    it('should create a promise which can be resolved externally.', async () => {
        const resolveValue = Math.random();

        const deferredPromise = createDeferredPromiseWrapper<number>();
        setTimeout(() => {
            deferredPromise.resolve(resolveValue);
        }, promiseDelayMs);

        expect(await deferredPromise.promise).to.equal(resolveValue);
    });

    it('should create a promise that can be rejected externally.', async () => {
        const message = 'this was rejected internally';
        const deferredPromise = createDeferredPromiseWrapper<number>();
        setTimeout(() => {
            deferredPromise.reject(message);
        }, promiseDelayMs);

        await assertThrows(() => deferredPromise.promise, {
            matchMessage: message,
        });
    });

    it('should settle after rejection', async () => {
        const examplePromise = createDeferredPromiseWrapper<number>();

        assert.isFalse(examplePromise.isSettled());

        examplePromise.reject('no reason');

        assert.isTrue(examplePromise.isSettled());
    });

    it('should settle after resolution', async () => {
        const examplePromise = createDeferredPromiseWrapper<number>();

        assert.isFalse(examplePromise.isSettled());

        examplePromise.resolve(Math.random());

        assert.isTrue(examplePromise.isSettled());
    });
});

describe(wait.name, () => {
    it('should create a promise which takes time to resolve.', async () => {
        const startTime = Date.now();

        await wait(promiseDelayMs);

        const endTime = Date.now();

        expect(endTime - startTime).to.be.greaterThanOrEqual(
            promiseDelayMs - 10 /* small buffer */,
        );
    });

    it('should resolve instantly when given a negative timeout', async () => {
        const startTime = Date.now();

        await wait(-500);

        const endTime = Date.now();

        // use a buffer of 100 ms
        expect(endTime - startTime).to.be.lessThanOrEqual(100);
    });

    it('should never resolve when given a timeout of Infinity', async () => {
        const startTime = Date.now();
        const timeoutSoTestActuallyFinishes = 1000;

        try {
            await wrapPromiseInTimeout(timeoutSoTestActuallyFinishes, wait(Infinity));
        } catch (error) {}
        const endTime = Date.now();
        expect(endTime - startTime).to.be.greaterThanOrEqual(
            timeoutSoTestActuallyFinishes - 10, // small buffer,
        );
    });
});

describe(wrapPromiseInTimeout.name, () => {
    it('should not reject a promise when it is resolved in time', async () => {
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

    it('should reject when the promise is not resolved in time', async () => {
        const startTime = Date.now();
        const deferredPromiseWrapper = createDeferredPromiseWrapper<number>();
        const promiseWithTimeout = wrapPromiseInTimeout(
            promiseDelayMs,
            deferredPromiseWrapper.promise,
        );

        await assertThrows(() => promiseWithTimeout, {
            matchConstructor: PromiseTimeoutError,
        });
        let timeoutError;
        try {
            await promiseWithTimeout;
        } catch (internalError) {
            timeoutError = internalError;
        }

        assertInstanceOf(timeoutError, PromiseTimeoutError);
        expect(timeoutError.message).to.equal(`Promised timed out after ${promiseDelayMs} ms.`);
        const endTime = Date.now();
        expect(endTime - startTime).to.be.greaterThanOrEqual(
            promiseDelayMs -
                // small buffer
                10,
        );
    });

    it('should reject if the given promise rejects', async () => {
        const testErrorMessage = randomString();

        await assertThrows(
            wrapPromiseInTimeout(Infinity, Promise.reject(new Error(testErrorMessage))),
            {
                matchMessage: testErrorMessage,
            },
        );
    });
});

describe(isPromiseLike.name, () => {
    it('should work', async () => {
        const waiting = wait(400);
        expect(isPromiseLike(waiting)).to.equal(true);
        const awaited = await waiting;
        expect(isPromiseLike(awaited)).to.equal(false);
    });
});

describe(waitForCondition.name, () => {
    it('should resolve once a condition is true', async () => {
        let condition = false;
        await waitForCondition({
            conditionCallback: () => {
                if (condition) {
                    return true;
                } else {
                    condition = true;
                    return false;
                }
            },
        });
        assert.isTrue(condition);
    });

    it('should wait until the condition is true', async () => {
        let condition = false;
        setTimeout(() => {
            condition = true;
        }, 1000);
        assert.isFalse(condition);
        await waitForCondition({
            conditionCallback: () => {
                return condition;
            },
        });
        assert.isTrue(condition);
    });

    it('should handle errors', async () => {
        const errorMessage = randomString();

        await assertThrows(
            waitForCondition({
                timeoutMs: 100,
                conditionCallback: () => {
                    throw new Error(errorMessage);
                },
            }),
            {
                matchMessage: errorMessage,
            },
        );
    });

    it('should use timeoutMessage', async () => {
        const timeoutMessage = randomString();

        await assertThrows(
            waitForCondition({
                timeoutMessage,
                timeoutMs: 100,
                conditionCallback: () => {
                    return false;
                },
            }),
            {
                matchMessage: timeoutMessage,
            },
        );
    });
});

describe('MaybePromise', () => {
    it('wraps in a promise', () => {
        assertTypeOf<MaybePromise<string>>().toEqualTypeOf<string | Promise<string>>();
        /** You have manually unwrap nested promises. */
        assertTypeOf<MaybePromise<Promise<string>>>().not.toEqualTypeOf<string | Promise<string>>();
    });
});
