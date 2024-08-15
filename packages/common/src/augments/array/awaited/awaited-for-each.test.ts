import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {measureExecutionDuration} from '../../function/execution-duration.js';
import {randomString} from '../../random/random-string.js';
import {awaitedForEach} from './awaited-for-each.js';

describe(awaitedForEach.name, () => {
    it('ensures execution order', async () => {
        const originalArray: string[] = new Array(5).fill(0).map(() => randomString());
        const results: string[] = [];
        let totalWait = 0;

        const duration = await measureExecutionDuration(async () => {
            await awaitedForEach(originalArray, async (element, index) => {
                if (index === 1) {
                    await wait({milliseconds: 1000});
                    totalWait += 1000;
                } else {
                    await wait({milliseconds: 50});
                    totalWait += 50;
                }
                results.push(element);
            });

            // ensure the order is the same despite a long wait time in the middle
        });

        assert.isAbove(duration.milliseconds, totalWait);
        assert.deepEquals(results, originalArray);
    });
});
