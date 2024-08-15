import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {measureExecutionDuration} from '../../function/execution-duration.js';
import {randomString} from '../../random/random-string.js';
import {awaitedBlockingMap} from './awaited-map.js';

describe(awaitedBlockingMap.name, () => {
    it('returns values and maintain execution order', async () => {
        const originalArray: string[] = new Array(5).fill(0).map(() => randomString());
        let totalWait = 0;
        const duration = await measureExecutionDuration(async () => {
            const results = await awaitedBlockingMap(originalArray, async (element, index) => {
                if (index === 1) {
                    await wait({milliseconds: 1000});
                    totalWait += 1000;
                } else {
                    await wait({milliseconds: 50});
                    totalWait += 50;
                }
                return {element};
            });

            // ensure the order is the same despite a long wait time in the middle
            assert.deepEquals(
                results.map((wrapper) => wrapper.element),
                originalArray,
            );
        });
        assert.isAbove(duration.milliseconds, totalWait);
    });
});
