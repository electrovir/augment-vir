import {itCases} from '@augment-vir/chai';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {addCommasToNumber, clamp, convertIntoNumber, ensureMinAndMax} from '../../../common/src';

describe(clamp.name, () => {
    it('should successfully clamp downwards', () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 150,
            }),
        ).to.equal(45);
    });

    it('should successfully clamp upwards', () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 13,
            }),
        ).to.equal(31);
    });

    it("shouldn't change values in the middle", () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 42,
            }),
        ).to.equal(42);
    });
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
            it: 'should add a comma to a thousand',
            input: 1_000,
            expect: '1,000',
        },
        {
            it: 'should handle an invalid number',
            input: 'not a number',
            expect: 'NaN',
        },
        {
            it: 'should handle string inputs',
            input: '1000000',
            expect: '1,000,000',
        },
        {
            it: 'should add multiple commas',
            input: 1_000_123_123,
            expect: '1,000,123,123',
        },
        {
            it: 'should add commas even when there are decimal points',
            input: 1_000_123.456,
            expect: '1,000,123.456',
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
