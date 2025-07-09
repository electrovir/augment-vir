import {describe, itCases} from '@augment-vir/test';
import {extractDuplicates} from './extract-duplicates.js';

describe(extractDuplicates.name, () => {
    itCases(extractDuplicates, [
        {
            it: 'handles no duplicates',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                    -1,
                ],
            ],
            expect: {
                duplicates: [],
                uniques: [
                    'a',
                    'b',
                    'c',
                    -1,
                ],
            },
        },
        {
            it: 'handles some duplicates',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                    -1,
                    'a',
                ],
            ],
            expect: {
                duplicates: [
                    'a',
                ],
                uniques: [
                    'b',
                    'c',
                    -1,
                ],
            },
        },
        {
            it: 'handles all duplicates',
            inputs: [
                [
                    'a',
                    'a',
                    'b',
                    'b',
                ],
            ],
            expect: {
                duplicates: [
                    'a',
                    'b',
                ],
                uniques: [],
            },
        },
        {
            it: 'uses custom comparator',
            inputs: [
                [
                    'a',
                    'a',
                    'b',
                    'b',
                ],
                () => false,
            ],
            expect: {
                duplicates: [],
                uniques: [
                    'a',
                    'a',
                    'b',
                    'b',
                ],
            },
        },
    ]);
});
