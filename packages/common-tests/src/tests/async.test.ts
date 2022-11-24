import {expectDuration, itCases} from '@augment-vir/chai';
import {randomString} from '@augment-vir/node-js';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {awaitedBlockingMap, awaitedForEach, wait} from '../../../common/src';
import {awaitedFilter} from '../../../common/src/augments/async';

describe(awaitedForEach.name, () => {
    it('should ensure execution order', async () => {
        const originalArray: string[] = Array(5)
            .fill(0)
            .map(() => randomString());
        const results: string[] = [];
        let totalWait = 0;
        (
            await expectDuration(async () => {
                await awaitedForEach(originalArray, async (element, index) => {
                    if (index === 1) {
                        await wait(1000);
                        totalWait += 1000;
                    } else {
                        await wait(50);
                        totalWait += 50;
                    }
                    results.push(element);
                });

                // ensure the order is the same despite a long wait time in the middle
            })
        ).to.be.greaterThanOrEqual(totalWait);
        expect(results).to.deep.equal(originalArray);
    });
});

describe(awaitedBlockingMap.name, () => {
    it('should return values and maintain execution order', async () => {
        const originalArray: string[] = Array(5)
            .fill(0)
            .map(() => randomString());
        let totalWait = 0;
        (
            await expectDuration(async () => {
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
                expect(results.map((wrapper) => wrapper.element)).to.deep.equal(originalArray);
            })
        ).to.be.greaterThanOrEqual(totalWait);
    });
});

describe(awaitedFilter.name, () => {
    itCases(awaitedFilter, [
        {
            it: 'should work with boolean return values',
            expect: ['yo'],
            inputs: [
                [
                    'hello there',
                    'yo',
                ],
                async (entry) => {
                    return entry === 'yo';
                },
            ],
        },
        {
            it: 'should work with non-boolean return values',
            expect: [
                'hello there',
                'yo',
            ],
            inputs: [
                [
                    'hello there',
                    'yo',
                    '',
                    0,
                ],
                async (entry) => {
                    return entry;
                },
            ],
        },
        {
            it: 'should work with actual async callbacks',
            expect: [
                'hello there',
                'yo',
            ],
            inputs: [
                [
                    'hello there',
                    'yo',
                    '',
                    0,
                ],
                async (entry) => {
                    await wait(1);
                    return entry;
                },
            ],
        },
    ]);

    it('should execute in order when blocking is true', async () => {
        const arrayToFilter = Array(10)
            .fill(0)
            .map(() => Math.random() * 10);
        const executionOrder: number[] = [];

        await awaitedFilter(
            arrayToFilter,
            async (entry) => {
                await wait(entry);
                executionOrder.push(entry);
                return true;
            },
            {blocking: true},
        );

        assert.deepStrictEqual(executionOrder, arrayToFilter);
    });
});
