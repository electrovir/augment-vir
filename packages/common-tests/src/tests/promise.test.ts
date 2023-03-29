import {assertTypeOf, typedAssertInstanceOf} from '@augment-vir/chai';
import {
    createDeferredPromiseWrapper,
    isPromiseLike,
    MaybePromise,
    PromiseTimeoutError,
    UnPromise,
    wait,
    waitForCondition,
    wrapPromiseInTimeout,
} from '@augment-vir/common';
import {randomString} from '@augment-vir/node-js';
import chai, {assert, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {describe, it} from 'mocha';

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

        chai.use(chaiAsPromised);
        await expect(deferredPromise.promise).to.be.rejectedWith(message);
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

        chai.use(chaiAsPromised);
        await expect(promiseWithTimeout).to.be.rejectedWith(PromiseTimeoutError);
        let timeoutError;
        try {
            await promiseWithTimeout;
        } catch (internalError) {
            timeoutError = internalError;
        }

        typedAssertInstanceOf(timeoutError, PromiseTimeoutError);
        expect(timeoutError.message).to.equal(`Promised timed out after ${promiseDelayMs} ms.`);
        const endTime = Date.now();
        expect(endTime - startTime).to.be.greaterThanOrEqual(
            promiseDelayMs -
                // small buffer
                10,
        );
    });

    it('should reject if the given promise rejects', async () => {
        chai.use(chaiAsPromised);
        const testErrorMessage = randomString();
        await assert.isRejected(
            wrapPromiseInTimeout(Infinity, Promise.reject(new Error(testErrorMessage))),
            testErrorMessage,
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

        chai.use(chaiAsPromised);
        await assert.isRejected(
            waitForCondition({
                timeoutMs: 100,
                conditionCallback: () => {
                    throw new Error(errorMessage);
                },
            }),
            errorMessage,
        );
    });

    it('should use timeoutMessage', async () => {
        const timeoutMessage = randomString();

        chai.use(chaiAsPromised);

        await assert.isRejected(
            waitForCondition({
                timeoutMessage,
                timeoutMs: 100,
                conditionCallback: () => {
                    return false;
                },
            }),
            timeoutMessage,
        );
    });
});

describe('UnPromise', () => {
    it('unwraps promises', () => {
        assertTypeOf<UnPromise<Promise<Promise<string>>>>().toEqualTypeOf<string>();
        assertTypeOf<UnPromise<string>>().toEqualTypeOf<string>();
    });
});

describe('MaybePromise', () => {
    it('wraps and unwraps promises', () => {
        assertTypeOf<MaybePromise<string>>().toEqualTypeOf<string | Promise<string>>();
        assertTypeOf<MaybePromise<Promise<string>>>().toEqualTypeOf<string | Promise<string>>();
    });
});
