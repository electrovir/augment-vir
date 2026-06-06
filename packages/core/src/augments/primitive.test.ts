import {describe, itCases} from '@augment-vir/test';
import {isPrimitive} from './primitive.js';

describe(isPrimitive.name, () => {
    itCases(isPrimitive, [
        {
            it: 'is true for a string',
            input: 'hello',
            expect: true,
        },
        {
            it: 'is true for an empty string',
            input: '',
            expect: true,
        },
        {
            it: 'is true for a number',
            input: 42,
            expect: true,
        },
        {
            it: 'is true for zero',
            input: 0,
            expect: true,
        },
        {
            it: 'is true for NaN',
            input: NaN,
            expect: true,
        },
        {
            it: 'is true for a bigint',
            input: 42n,
            expect: true,
        },
        {
            it: 'is true for a boolean',
            input: false,
            expect: true,
        },
        {
            it: 'is true for a symbol',
            input: Symbol('example'),
            expect: true,
        },
        {
            it: 'is true for null',
            input: null,
            expect: true,
        },
        {
            it: 'is true for undefined',
            input: undefined,
            expect: true,
        },
        {
            it: 'is false for a plain object',
            input: {
                a: 1,
            },
            expect: false,
        },
        {
            it: 'is false for an array',
            input: [
                1,
                2,
                3,
            ],
            expect: false,
        },
        {
            it: 'is false for a function',
            input: () => {},
            expect: false,
        },
        {
            it: 'is false for a Map',
            input: new Map(),
            expect: false,
        },
        {
            it: 'is false for a regular expression',
            input: /abc/,
            expect: false,
        },
    ]);
});
