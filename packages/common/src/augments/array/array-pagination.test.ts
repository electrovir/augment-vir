import {describe, itCases} from '@augment-vir/test';
import {chunkArray, getArrayPage} from './array-pagination.js';

describe(chunkArray.name, () => {
    itCases(chunkArray, [
        {
            it: 'handles 0 chunk size',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                {
                    chunkSize: 0,
                },
            ],
            expect: [
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
        },
        {
            it: 'splits into uneven chunk sizes',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                {
                    chunkSize: 2,
                },
            ],
            expect: [
                [
                    'a',
                    'b',
                ],
                ['c'],
            ],
        },
        {
            it: 'splits into even chunk sizes',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                    'd',
                ],
                {
                    chunkSize: 2,
                },
            ],
            expect: [
                [
                    'a',
                    'b',
                ],
                [
                    'c',
                    'd',
                ],
            ],
        },
        {
            it: 'splits into uneven chunk count',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                {
                    chunkCount: 2,
                },
            ],
            expect: [
                [
                    'a',
                    'b',
                ],
                ['c'],
            ],
        },
        {
            it: 'splits into even chunk count',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                    'd',
                ],
                {
                    chunkCount: 2,
                },
            ],
            expect: [
                [
                    'a',
                    'b',
                ],
                [
                    'c',
                    'd',
                ],
            ],
        },
        {
            it: 'splits into too high chunk count',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                    'd',
                ],
                {
                    chunkCount: 6,
                },
            ],
            expect: [
                ['a'],
                ['b'],
                ['c'],
                ['d'],
            ],
        },
    ]);
});

describe(getArrayPage.name, () => {
    itCases(getArrayPage, [
        {
            it: 'gets a page',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                {
                    countPerPage: 2,
                    getPage: 1,
                },
            ],
            expect: ['c'],
        },
        {
            it: 'fails on negative page',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                {
                    countPerPage: 2,
                    getPage: -1,
                },
            ],
            expect: undefined,
        },
        {
            it: 'fails on too high page',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
                {
                    countPerPage: 2,
                    getPage: 10,
                },
            ],
            expect: undefined,
        },
    ]);
});
