import {describe, itCases} from '@augment-vir/test';
import {toEnsuredNumber, toNumber} from './number-conversion.js';

describe(toNumber.name, () => {
    itCases(toNumber, [
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
            expect: 1_988_859_905_000,
        },
        {
            it: 'should just return NaN for other values',
            input: /this-is-a-regex/,
            expect: NaN,
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
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'errors on object input',
            input: {},
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
});
