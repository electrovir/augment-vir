import {describe, itCases} from '@augment-vir/test';
import {mergeDeep} from './merge-deep.js';

describe(mergeDeep.name, () => {
    itCases(mergeDeep, [
        {
            it: 'returns an empty object is no inputs are given',
            inputs: [],
            expect: {},
        },
        {
            it: 'returns the first object if only one is given',
            inputs: [{first: 'hello'}],
            expect: {first: 'hello'},
        },
        {
            it: 'removes keys overridden with undefined',
            inputs: [
                {
                    a: 'hi',
                    b: 'bye',
                },
                {
                    b: undefined,
                },
            ],
            expect: {
                a: 'hi',
            },
        },
        {
            it: 'overrides array values',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                    'd',
                    'e',
                    'f',
                ],
                [
                    'a',
                    'b',
                    undefined,
                    undefined,
                    'e',
                ],
            ],
            expect: [
                'a',
                'b',
                undefined,
                undefined,
                'e',
            ],
        },
        {
            it: 'overwrites array entries',
            inputs: [
                [
                    {a: 'b', c: 'd'},
                    {q: 'r', s: 't'},
                ],
                [
                    {e: 'f', g: 'h'},
                    {q: 'rZr', s: 'tZt', u: 'v'},
                ],
            ],
            expect: [
                {e: 'f', g: 'h'},
                {q: 'rZr', s: 'tZt', u: 'v'},
            ],
        },
        {
            it: 'does a shallow merge',
            inputs: [
                {first: 'hello'},
                {second: 'hi'},
            ],
            expect: {first: 'hello', second: 'hi'},
        },
        {
            it: 'overwrite previous properties',
            inputs: [
                {first: 'hello'},
                {second: 'hi'},
                {first: 'goodbye'},
            ],
            expect: {first: 'goodbye', second: 'hi'},
        },
        {
            it: 'merges properties recursively',
            inputs: [
                {
                    first: 'hello',
                    nested: {
                        nestedFirst: 'again',
                        nestedSecond: 'base',
                    },
                },
                {
                    second: 'hi',
                    nested: {
                        nestedSecond: 'overridden',
                    },
                },
                {first: 'goodbye'},
            ],
            expect: {
                first: 'goodbye',
                second: 'hi',
                nested: {
                    nestedFirst: 'again',
                    nestedSecond: 'overridden',
                },
            },
        },
        {
            it: 'overwrites nested arrays',
            inputs: [
                {
                    first: 'hello',
                    arrayProp: [
                        1,
                        2,
                        3,
                        4,
                    ],
                },
                {
                    second: 'hi',
                    arrayProp: [
                        9,
                        10,
                    ],
                },
            ],
            expect: {
                first: 'hello',
                second: 'hi',
                arrayProp: [
                    9,
                    10,
                ],
            },
        },
    ]);
});
