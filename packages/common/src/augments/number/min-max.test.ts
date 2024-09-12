import {describe, itCases} from '@augment-vir/test';
import {ensureMinMax} from './min-max.js';

describe(ensureMinMax.name, () => {
    itCases(ensureMinMax, [
        {
            it: 'returns correctly ordered min and max unchanged',
            input: {
                min: 0,
                max: 10,
            },
            expect: {min: 0, max: 10},
        },
        {
            it: 'fixes out of order min and max',
            input: {
                min: 12,
                max: 2,
            },
            expect: {min: 2, max: 12},
        },
        {
            it: 'leaves correctly ordered negative values alone',
            input: {
                min: -16,
                max: -1,
            },
            expect: {min: -16, max: -1},
        },
        {
            it: 'fixes out of order negative values',
            input: {
                min: -3,
                max: -21,
            },
            expect: {min: -21, max: -3},
        },
        {
            it: 'leaves correctly ordered values across the negative boundary',
            input: {
                min: -33,
                max: 7,
            },
            expect: {min: -33, max: 7},
        },
        {
            it: 'fixes out of order values across the negative boundary',
            input: {
                min: 17,
                max: -42,
            },
            expect: {min: -42, max: 17},
        },
        {
            it: 'fixes values with a zero',
            input: {
                min: 0,
                max: -9,
            },
            expect: {min: -9, max: 0},
        },
        {
            it: 'fixes values with decimals',
            input: {
                min: 1.5,
                max: 1.3,
            },
            expect: {min: 1.3, max: 1.5},
        },
    ]);
});
