import {describe, itCases} from '@augment-vir/test';
import {joinWithFinalConjunction} from './join.js';

describe(joinWithFinalConjunction.name, () => {
    itCases(joinWithFinalConjunction, [
        {
            it: 'returns empty string when given an empty array',
            inputs: [[]],
            expect: '',
        },
        {
            it: 'does not add a comma to only two items',
            inputs: [
                [
                    'a',
                    'b',
                ],
            ],
            expect: 'a and b',
        },
        {
            it: 'joins 3 strings',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: 'a, b, and c',
        },
        {
            it: 'joins 5 strings',
            inputs: [
                [
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
            ],
            expect: '1, 2, 3, 4, and 5',
        },
        {
            it: 'uses a custom conjunction',
            inputs: [
                [
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
                'or',
            ],
            expect: '1, 2, 3, 4, or 5',
        },
        {
            it: 'even joins non-string inputs',
            inputs: [
                [
                    {},
                    {},
                    {},
                    {},
                    {},
                ],
            ],
            expect: '[object Object], [object Object], [object Object], [object Object], and [object Object]',
        },
    ]);
});
