import {assert, check} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {measureExecutionDuration} from '../../function/execution-duration.js';
import {randomString} from '../../random/random-string.js';
import {awaitedFind} from './awaited-find.js';

describe(awaitedFind.name, () => {
    it('ensures execution order', async () => {
        const originalArray: string[] = new Array(5).fill(0).map(() => randomString());
        const results: string[] = [];
        let totalWait = 0;

        const duration = await measureExecutionDuration(async () => {
            await awaitedFind(originalArray, async (element, index) => {
                if (index === 1) {
                    await wait({milliseconds: 1000});
                    totalWait += 1000;
                } else {
                    await wait({milliseconds: 50});
                    totalWait += 50;
                }
                results.push(element);

                return false;
            });
        });

        assert.isAbove(duration.milliseconds, totalWait);
        assert.deepEquals(results, originalArray);
    });

    it('has proper types with async callback', async () => {
        const originalArray: string[] = ['a'];
        assert
            .tsType(
                await awaitedFind(originalArray, async (item, index, array) => {
                    assert.tsType(item).equals<string>();
                    assert.tsType(index).equals<number>();
                    assert.tsType(array).equals<ReadonlyArray<string>>();
                    assert.strictEquals(array, originalArray);

                    await wait({seconds: 0});

                    return true;
                }),
            )
            .equals<string | undefined>();
    });
    it('has proper types with sync callback', async () => {
        const originalArray: string[] = ['a'];
        assert
            .tsType(
                await awaitedFind(originalArray, (item, index, array) => {
                    assert.tsType(item).equals<string>();
                    assert.tsType(index).equals<number>();
                    assert.tsType(array).equals<ReadonlyArray<string>>();
                    assert.strictEquals(array, originalArray);

                    return true;
                }),
            )
            .equals<string | undefined>();
    });

    itCases(awaitedFind, [
        {
            it: 'finds nothing with async callback',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                async (value) => {
                    await wait({seconds: 0});
                    return check.isNumber(value);
                },
            ],
            expect: undefined,
        },
        {
            it: 'finds nothing with sync callback',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                (value) => {
                    return check.isNumber(value);
                },
            ],
            expect: undefined,
        },
        {
            it: 'finds something with async callback',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                async (value) => {
                    await wait({seconds: 0});
                    return value === 'b';
                },
            ],
            expect: 'b',
        },
        {
            it: 'finds something with sync callback',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                (value) => {
                    return value === 'b';
                },
            ],
            expect: 'b',
        },
    ]);
});
