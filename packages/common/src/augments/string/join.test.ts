import {describe, itCases} from '@augment-vir/test';
import {joinWithFinalConjunction} from './join.js';

describe(joinWithFinalConjunction.name, () => {
    itCases(joinWithFinalConjunction, [
        {
            it: 'should return empty string when given an empty array',
            inputs: [[]],
            expect: '',
        },
        {
            it: 'should not add a comma to only two items',
            inputs: [
                [
                    'a',
                    'b',
                ],
            ],
            expect: 'a and b',
        },
        {
            it: 'should join 3 strings',
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
            it: 'should join 5 strings',
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
            it: 'should use a custom conjunction',
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
            it: 'should even join non-string inputs',
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
