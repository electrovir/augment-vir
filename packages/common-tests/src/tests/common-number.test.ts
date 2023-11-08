import {itCases} from '@augment-vir/chai';
import {
    Dimensions,
    addCommasToNumber,
    clamp,
    convertIntoNumber,
    ensureMinAndMax,
    round,
    toEnsuredNumber,
} from '@augment-vir/common';
import {describe, it} from 'mocha';

describe(clamp.name, () => {
    itCases(clamp, [
        {
            it: 'does not alter a within-range value',
            input: {
                max: 50,
                min: 40,
                value: 42,
            },
            expect: 42,
        },
        {
            it: 'clamps a too high number',
            input: {
                max: 50,
                min: 40,
                value: 1_000,
            },
            expect: 50,
        },
        {
            it: 'clamps a too low number',
            input: {
                max: 50,
                min: 40,
                value: 20,
            },
            expect: 40,
        },
    ]);
});

describe(convertIntoNumber.name, () => {
    itCases(convertIntoNumber, [
        {
            it: 'should simply return back a number input',
            input: 5,
            expect: 5,
        },
        {
            it: 'should convert a string to a number',
            input: '42',
            expect: 42,
        },
        {
            it: 'should handle decimals',
            input: 5.63,
            expect: 5.63,
        },
        {
            it: 'should handle decimals in a string',
            input: '9.87',
            expect: 9.87,
        },
        {
            it: 'should handle commas in a string',
            input: '9,123.87',
            expect: 9123.87,
        },
        {
            it: 'should even handle commas in incorrect places in a string',
            input: '1,2,3,8.,6,7',
            expect: 1238.67,
        },
        {
            it: 'should coerce date objects into a number',
            input: new Date('2033-01-09T05:05:05Z'),
            expect: 1988859905000,
        },
        {
            it: 'should just return NaN for other values',
            input: /this-is-a-regex/,
            expect: NaN,
        },
    ]);
});

describe(addCommasToNumber.name, () => {
    itCases(addCommasToNumber, [
        {
            it: 'adds a comma to a thousand',
            input: 1_000,
            expect: '1,000',
        },
        {
            it: 'handles an invalid number',
            input: 'not a number',
            expect: 'NaN',
        },
        {
            it: 'handles string inputs',
            input: '1000000',
            expect: '1,000,000',
        },
        {
            it: 'adds multiple commas',
            input: 1_000_123_123,
            expect: '1,000,123,123',
        },
        {
            it: 'adds commas even when there are decimal points',
            input: 1_000_123.456,
            expect: '1,000,123.456',
        },
        {
            it: 'does not put a comma after the negative',
            input: -100000,
            expect: '-100,000',
        },
    ]);
});

describe(ensureMinAndMax.name, () => {
    itCases(ensureMinAndMax, [
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

describe('Dimensions', () => {
    it('is assignable to from expected object shape', () => {
        const testDimensions: Dimensions = {
            width: 0,
            height: Infinity,
        };
    });
});
