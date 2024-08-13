import {itCases} from '@augment-vir/browser-testing';
import {diffArrays, diffObjects, diffValues} from './diff';

describe(diffObjects.name, () => {
    itCases(diffObjects, [
        {
            it: 'returns no diff with empty objects',
            inputs: [
                {},
                {},
            ],
            expect: [],
        },
        {
            it: 'returns no diff with equivalent objects',
            inputs: [
                {a: 'hi'},
                {a: 'hi'},
            ],
            expect: [],
        },
        {
            it: 'diffs different value types',
            inputs: [
                {a: 'hi'},
                {a: 321},
            ],
            expect: [
                {a: 'hi'},
                {a: 321},
            ],
        },
        {
            it: 'diffs same values as different types',
            inputs: [
                {a: '321'},
                {a: 321},
            ],
            expect: [
                {a: '321'},
                {a: 321},
            ],
        },
        {
            it: 'diffs with multiple keys',
            inputs: [
                {
                    a: 'equal key 1',
                    b: 'different key 1',
                    d: 'equal key 2',
                },
                {
                    a: 'equal key 1',
                    b: 'different key 2',
                    c: 'missing key',
                    d: 'equal key 2',
                },
            ],
            expect: [
                {
                    b: 'different key 1',
                },
                {
                    b: 'different key 2',
                    c: 'missing key',
                },
            ],
        },
        {
            it: 'calculates nested diff',
            inputs: [
                {
                    a: 'top level equal',
                    b: {
                        c: 'nested equal',
                        d: 'nested not equal 1',
                        e: 'nested missing',
                    },
                },
                {
                    a: 'top level equal',
                    b: {
                        c: 'nested equal',
                        d: 'nested not equal 2',
                    },
                    f: {
                        g: 'nested entirely missing 1',
                        h: 'nested entirely missing 2',
                    },
                },
            ],
            expect: [
                {
                    b: {
                        d: 'nested not equal 1',
                        e: 'nested missing',
                    },
                },
                {
                    b: {
                        d: 'nested not equal 2',
                    },
                    f: {
                        g: 'nested entirely missing 1',
                        h: 'nested entirely missing 2',
                    },
                },
            ],
        },
        {
            it: 'diffs sub arrays',
            inputs: [
                {
                    a: 'top level equal',
                    b: [
                        'equal',
                        'not equal 1',
                        'missing',
                    ],
                },
                {
                    a: 'top level equal',
                    b: [
                        'equal',
                        'not equal 2',
                    ],
                },
            ],
            expect: [
                {
                    b: [
                        'not equal 1',
                        'missing',
                    ],
                },
                {
                    b: [
                        'not equal 2',
                    ],
                },
            ],
        },
        {
            it: 'diffs nested objects in nested arrays',
            inputs: [
                {
                    a: 'top level equal',
                    b: [
                        [
                            'c',
                            {
                                d: 'equal 1',
                                e: 'not equal 1',
                                f: [
                                    'equal 2',
                                    ,
                                    'not equal 1',
                                ],
                            },
                            'not equal 1',
                        ],
                    ],
                },
                {
                    a: 'top level equal',
                    b: [
                        [
                            'c',
                            {
                                d: 'equal 1',
                                e: 'not equal 2',
                                f: [
                                    'equal 2',
                                    'missing',
                                    'not equal 2',
                                ],
                            },
                            'not equal 2',
                        ],
                    ],
                },
            ],
            expect: [
                {
                    b: [
                        [
                            {
                                e: 'not equal 1',
                                f: [
                                    'not equal 1',
                                ],
                            },
                            'not equal 1',
                        ],
                    ],
                },
                {
                    b: [
                        [
                            {
                                e: 'not equal 2',
                                f: [
                                    'missing',
                                    'not equal 2',
                                ],
                            },
                            'not equal 2',
                        ],
                    ],
                },
            ],
        },
    ]);
});

describe(diffValues.name, () => {
    itCases(diffValues, [
        {
            it: 'returns nothing for equal regular expressions',
            inputs: [
                /hello there/,
                /hello there/,
            ],
            expect: [],
        },
        {
            it: 'diffs regular expressions',
            inputs: [
                /hello there/,
                /hello not there/,
            ],
            expect: [
                /hello there/,
                /hello not there/,
            ],
        },
    ]);
});

describe(diffArrays.name, () => {
    itCases(diffArrays, [
        {
            it: 'returns nothing for empty arrays',
            inputs: [
                [],
                [],
            ],
            expect: [],
        },
        {
            it: 'returns nothing for equal arrays',
            inputs: [
                [
                    'a',
                    'b',
                ],
                [
                    'a',
                    'b',
                ],
            ],
            expect: [],
        },
    ]);
});
