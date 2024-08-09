import {assert, describe, it} from '@augment-vir/test';
import {assertInstanceOf, assertThrows} from 'run-time-assertions';
import {randomString} from '../random/random-string.js';
import {DeferredPromise} from './deferred-promise.js';
import {PromiseTimeoutError, wrapPromiseInTimeout} from './timed-promise.js';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelayMs = 500;

describe(wrapPromiseInTimeout.name, () => {
    it('should not reject a promise when it is resolved in time', async () => {
        const startTime = Date.now();
        const deferredPromiseWrapper = new DeferredPromise<number>();
        const promiseWithTimeout = wrapPromiseInTimeout(
            promiseDelayMs,
            deferredPromiseWrapper.promise,
        );

        const resolutionValue: number = Math.random();

        deferredPromiseWrapper.resolve(resolutionValue);

        assert.strictEqual(await promiseWithTimeout, resolutionValue);
        const endTime = Date.now();
        assert.isBelow(endTime - startTime, promiseDelayMs);
    });

    it('should reject when the promise is not resolved in time', async () => {
        const startTime = Date.now();
        const deferredPromiseWrapper = new DeferredPromise<number>();
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
        assert.strictEqual(timeoutError.message, `Promised timed out after ${promiseDelayMs} ms.`);
        const endTime = Date.now();
        assert.isAbove(
            endTime - startTime,
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
