import {describe, itCases} from '@augment-vir/test';
import {wrapNumber} from './wrap-number.js';

describe(wrapNumber.name, () => {
    itCases(wrapNumber, [
        {
            it: 'wraps above max',
            inputs: [
                10,
                {min: 0, max: 5},
            ],
            expect: 0,
        },
        {
            it: 'wraps below min',
            inputs: [
                1,
                {min: 5, max: 10},
            ],
            expect: 10,
        },
        {
            it: 'ignores in-between values',
            inputs: [
                5,
                {min: 0, max: 10},
            ],
            expect: 5,
        },
    ]);
});
