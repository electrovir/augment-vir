import {describe} from '@augment-vir/test';
import {assert} from 'chai';
import {wait} from '../../promise/wait.js';
import {awaitedFilter} from './awaited-filter.js';

describe(awaitedFilter.name, ({itCases, it}) => {
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
                    // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
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
                    // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
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
                    await wait(1);
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
                await wait(entry);
                executionOrder.push(entry);
                return true;
            },
            {blocking: true},
        );

        assert.deepStrictEqual(executionOrder, arrayToFilter);
    });
});
