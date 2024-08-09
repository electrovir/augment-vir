import {assert, describe, it} from '@augment-vir/test';
import {wrapPromiseInTimeout} from './timed-promise.js';
import {wait} from './wait.js';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelayMs = 500;

describe(wait.name, () => {
    it('should create a promise which takes time to resolve.', async () => {
        const startTime = Date.now();

        await wait(promiseDelayMs);

        const endTime = Date.now();

        assert.isAbove(endTime - startTime, promiseDelayMs - 10 /* small buffer */);
    });

    it('should resolve instantly when given a negative timeout', async () => {
        const startTime = Date.now();

        await wait(-500);

        const endTime = Date.now();

        // use a buffer of 100 ms
        assert.isBelow(endTime - startTime, 100);
    });

    it('should never resolve when given a timeout of Infinity', async () => {
        const startTime = Date.now();
        const timeoutSoTestActuallyFinishes = 1000;

        try {
            await wrapPromiseInTimeout(timeoutSoTestActuallyFinishes, wait(Infinity));
        } catch (error) {}
        const endTime = Date.now();
        assert.isAbove(
            endTime - startTime,
            timeoutSoTestActuallyFinishes - 10, // small buffer,
        );
    });
});
