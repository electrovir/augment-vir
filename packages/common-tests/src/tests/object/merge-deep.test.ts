import {itCases} from '@augment-vir/chai';
import {mergeDeep} from '@augment-vir/common';

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
            it: 'does not merge arrays',
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
