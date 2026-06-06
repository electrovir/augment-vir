import {describe, itCases} from '@augment-vir/test';
import {convertTo} from './convert-to.js';

describe('convertTo.string', () => {
    itCases(convertTo.string, [
        {
            it: 'returns a string as-is',
            input: 'hello',
            expect: 'hello',
        },
        {
            it: 'preserves an empty string',
            input: '',
            expect: '',
        },
        {
            it: 'converts a number',
            input: 42,
            expect: '42',
        },
        {
            it: 'converts a bigint',
            input: 42n,
            expect: '42',
        },
        {
            it: 'converts a boolean',
            input: true,
            expect: 'true',
        },
        {
            it: 'converts a symbol',
            input: Symbol('example'),
            expect: 'Symbol(example)',
        },
        {
            it: 'converts null',
            input: null,
            expect: 'null',
        },
        {
            it: 'converts undefined',
            input: undefined,
            expect: 'undefined',
        },
        {
            it: 'stringifies a plain object',
            input: {
                a: 1,
            },
            expect: '{a:1}',
        },
        {
            it: 'stringifies an array',
            input: [
                1,
                2,
                3,
            ],
            expect: '[1,2,3]',
        },
    ]);
});

describe('convertTo.maybeString', () => {
    itCases(convertTo.maybeString, [
        {
            it: 'returns undefined for null',
            input: null,
            expect: undefined,
        },
        {
            it: 'returns undefined for undefined',
            input: undefined,
            expect: undefined,
        },
        {
            it: 'returns undefined for an empty string',
            input: '',
            expect: undefined,
        },
        {
            it: 'returns a string as-is',
            input: 'hello',
            expect: 'hello',
        },
        {
            it: 'converts a number',
            input: 42,
            expect: '42',
        },
        {
            it: 'keeps the string for zero',
            input: 0,
            expect: '0',
        },
        {
            it: 'stringifies a plain object',
            input: {
                a: 1,
            },
            expect: '{a:1}',
        },
    ]);
});

describe('convertTo.maybeNumber', () => {
    itCases(convertTo.maybeNumber, [
        {
            it: 'returns undefined for null',
            input: null,
            expect: undefined,
        },
        {
            it: 'returns undefined for undefined',
            input: undefined,
            expect: undefined,
        },
        {
            it: 'returns a number as-is',
            input: 42,
            expect: 42,
        },
        {
            it: 'keeps zero',
            input: 0,
            expect: 0,
        },
        {
            it: 'parses a numeric string',
            input: '42',
            expect: 42,
        },
        {
            it: 'parses a decimal string',
            input: '3.14',
            expect: 3.14,
        },
        {
            it: 'returns undefined for empty string',
            input: '',
            expect: undefined,
        },
        {
            it: 'converts a boolean',
            input: true,
            expect: 1,
        },
        {
            it: 'returns undefined for a non-numeric string',
            input: 'hello',
            expect: undefined,
        },
        {
            it: 'returns undefined for a plain object',
            input: {
                a: 1,
            },
            expect: undefined,
        },
    ]);
});
