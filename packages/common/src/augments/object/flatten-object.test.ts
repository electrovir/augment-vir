import {describe, itCases} from '@augment-vir/test';
import {flattenObject} from './flatten-object.js';

describe(flattenObject.name, () => {
    itCases(flattenObject, [
        {
            it: 'does nothing without nesting',
            input: {
                a: 'hi',
            },
            expect: {
                a: 'hi',
            },
        },
        {
            it: 'does nothing with empty object',
            input: {},
            expect: {},
        },
        {
            it: 'flattens an object',
            input: {
                a: 'hi',
                b: {
                    b1: 2,
                    c: {
                        nested: 'value',
                    },
                },
            },
            expect: {
                a: 'hi',
                b1: 2,
                nested: 'value',
            },
        },
        {
            it: 'overrides repeated keys',
            input: {
                a: 'hi',
                b: {
                    a: 'bye',
                },
            },
            expect: {
                a: 'bye',
            },
        },
    ]);
});
