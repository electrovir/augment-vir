import {assert} from '@augment-vir/assert';
import {DeferredPromise} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {randomString} from '../random/random-string.js';
import {PromiseTimeoutError, wrapPromiseInTimeout} from './timed-promise.js';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelay = {milliseconds: 500};

describe(wrapPromiseInTimeout.name, () => {
    it('should not reject a promise when it is resolved in time', async () => {
        const startTime = Date.now();
        const deferredPromiseWrapper = new DeferredPromise<number>();
        const promiseWithTimeout = wrapPromiseInTimeout(
            promiseDelay,
            deferredPromiseWrapper.promise,
        );

        const resolutionValue: number = Math.random();

        deferredPromiseWrapper.resolve(resolutionValue);

        assert.strictEquals(await promiseWithTimeout, resolutionValue);
        const endTime = Date.now();
        assert.isBelow(endTime - startTime, promiseDelay.milliseconds);
    });

    it('should reject when the promise is not resolved in time', async () => {
        const startTime = Date.now();
        const deferredPromiseWrapper = new DeferredPromise<number>();
        const promiseWithTimeout = wrapPromiseInTimeout(
            promiseDelay,
            deferredPromiseWrapper.promise,
        );

        await assert.throws(() => promiseWithTimeout, {
            matchConstructor: PromiseTimeoutError,
        });
        let timeoutError;
        try {
            await promiseWithTimeout;
        } catch (internalError) {
            timeoutError = internalError;
        }

        assert.instanceOf(timeoutError, PromiseTimeoutError);
        assert.strictEquals(
            timeoutError.message,
            `Promised timed out after ${promiseDelay.milliseconds} ms.`,
        );
        const endTime = Date.now();
        assert.isAbove(
            endTime - startTime,
            promiseDelay.milliseconds -
                // small buffer
                10,
        );
    });

    it('should reject if the given promise rejects', async () => {
        const testErrorMessage = randomString();

        await assert.throws(
            wrapPromiseInTimeout(
                {milliseconds: Infinity},
                Promise.reject(new Error(testErrorMessage)),
            ),
            {
                matchMessage: testErrorMessage,
            },
        );
    });
});
