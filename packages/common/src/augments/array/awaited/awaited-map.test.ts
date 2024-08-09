import {assert, describe, it} from '@augment-vir/test';
import {measureExecutionDuration} from '../../function/execution-duration.js';
import {wait} from '../../promise/wait.js';
import {randomString} from '../../random/random-string.js';
import {awaitedBlockingMap} from './awaited-map.js';

describe(awaitedBlockingMap.name, () => {
    it('returns values and maintain execution order', async () => {
        const originalArray: string[] = new Array(5).fill(0).map(() => randomString());
        let totalWait = 0;
        const duration = await measureExecutionDuration(async () => {
            const results = await awaitedBlockingMap(originalArray, async (element, index) => {
                if (index === 1) {
                    await wait(1000);
                    totalWait += 1000;
                } else {
                    await wait(50);
                    totalWait += 50;
                }
                return {element};
            });

            // ensure the order is the same despite a long wait time in the middle
            assert.deepStrictEqual(
                results.map((wrapper) => wrapper.element),
                originalArray,
            );
        });
        assert.isAbove(duration.milliseconds, totalWait);
    });
});
