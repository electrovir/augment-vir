import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {awaitedFilter} from './awaited-filter.js';

describe(awaitedFilter.name, () => {
    itCases(awaitedFilter, [
        {
            it: 'handles boolean return values',
            expect: ['yo'],
            inputs: [
                [
                    'hello there',
                    'yo',
                ],
                async (entry) => {
                    return Promise.resolve(entry === 'yo');
                },
            ],
        },
        {
            it: 'handles non-boolean return values',
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
                    return Promise.resolve(entry);
                },
            ],
        },
        {
            it: 'handles async callbacks',
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
                    await wait({milliseconds: 1});
                    return entry;
                },
            ],
        },
    ]);

    it('executes in order when blocking is true', async () => {
        const arrayToFilter = new Array(10).fill(0).map(() => Math.random() * 10);
        const executionOrder: number[] = [];

        await awaitedFilter(
            arrayToFilter,
            async (entry) => {
                await wait({milliseconds: entry});
                executionOrder.push(entry);
                return true;
            },
            {blocking: true},
        );

        assert.deepEquals(executionOrder, arrayToFilter);
    });
});
