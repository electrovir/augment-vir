import {describe} from '@augment-vir/test';
import {round} from './round.js';

describe(round.name, ({itCases}) => {
    itCases(round, [
        {
            it: 'rounds down with 2 decimals',
            inputs: [
                1.123_456,
                {
                    digits: 2,
                },
            ],
            expect: 1.12,
        },
        {
            it: 'rounds up with 2 decimals',
            inputs: [
                1.125_456,
                {
                    digits: 2,
                },
            ],
            expect: 1.13,
        },
        {
            it: 'rounds up with 3 decimals and a carry',
            inputs: [
                1.129_556,
                {
                    digits: 3,
                },
            ],
            expect: 1.13,
        },
        {
            it: 'rounds up with 0 decimals',
            inputs: [
                1.564_123,
                {
                    digits: 0,
                },
            ],
            expect: 2,
        },
    ]);
});
