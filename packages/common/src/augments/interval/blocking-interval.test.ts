import {assert, waitUntil} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {createBlockingInterval} from './blocking-interval.js';

describe(createBlockingInterval.name, () => {
    it('creates an interval', async () => {
        let callCount = 0;
        const {clearInterval} = createBlockingInterval(
            () => {
                ++callCount;
            },
            {
                milliseconds: 1,
            },
        );

        await waitUntil.isAbove(5, () => callCount);
        clearInterval();
        await wait({seconds: 1});
        const savedCallCount = callCount;

        await wait({seconds: 2});
        assert.strictEquals(savedCallCount, callCount);
    });
    it('prevents overlapping executions', async () => {
        let callCount = 0;
        const {clearInterval} = createBlockingInterval(
            async () => {
                await wait({seconds: 1});
                ++callCount;
            },
            {
                milliseconds: 1,
            },
        );
        const start = Date.now();

        await waitUntil.isAbove(2, () => callCount);
        clearInterval();
        assert.isAbove(Date.now() - start, 10);
    });
});
