import {itCases} from '@augment-vir/chai';
import {round, toEnsuredNumber} from '@augment-vir/common';

describe(toEnsuredNumber.name, () => {
    itCases(toEnsuredNumber, [
        {
            it: 'converts a string to a number',
            input: '5',
            expect: 5,
        },
        {
            it: 'errors on invalid number string',
            input: '5-3',
            throws: Error,
        },
        {
            it: 'errors on object input',
            input: {},
            throws: Error,
        },
    ]);
});

describe(round.name, () => {
    itCases(round, [
        {
            it: 'rounds down with 2 decimals',
            input: {
                digits: 2,
                number: 1.123456,
            },
            expect: 1.12,
        },
        {
            it: 'rounds up with 2 decimals',
            input: {
                digits: 2,
                number: 1.125456,
            },
            expect: 1.13,
        },
        {
            it: 'rounds up with 3 decimals and a carry',
            input: {
                digits: 3,
                number: 1.129556,
            },
            expect: 1.13,
        },
        {
            it: 'rounds up with 0 decimals',
            input: {
                digits: 0,
                number: 1.564123,
            },
            expect: 2,
        },
    ]);
});
