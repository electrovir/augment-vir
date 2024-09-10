import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {arrayToObject, groupArrayBy} from './array-to-object.js';

describe(groupArrayBy.name, () => {
    itCases(groupArrayBy, [
        {
            it: 'handles an empty array',
            inputs: [
                [],
                () => {
                    return 'five';
                },
            ],
            expect: {},
        },
        {
            it: 'groups by callback value',
            inputs: [
                [
                    {
                        a: 'b',
                        b: 'c',
                        c: 'd',
                        e: 'f',
                    },
                    {
                        a: 'a',
                        b: 'b',
                        c: 'c',
                        e: 'd',
                    },
                    {
                        a: 'z',
                        b: 'y',
                        c: 'x',
                        e: 'w',
                    },
                ],
                (entry: any) => {
                    return entry.c;
                },
            ],
            expect: {
                d: [
                    {
                        a: 'b',
                        b: 'c',
                        c: 'd',
                        e: 'f',
                    },
                ],
                c: [
                    {
                        a: 'a',
                        b: 'b',
                        c: 'c',
                        e: 'd',
                    },
                ],
                x: [
                    {
                        a: 'z',
                        b: 'y',
                        c: 'x',
                        e: 'w',
                    },
                ],
            },
        },
        {
            it: 'handles duplicate groupings',
            inputs: [
                [
                    {
                        a: 'b',
                        b: 'c',
                        c: 'd',
                        e: 'f',
                    },
                    {
                        a: 'a',
                        b: 'b',
                        c: 'd',
                        e: 'd',
                    },
                    {
                        a: 'z',
                        b: 'y',
                        c: 'x',
                        e: 'w',
                    },
                ],
                (entry: any) => {
                    return entry.c;
                },
            ],
            expect: {
                d: [
                    {
                        a: 'b',
                        b: 'c',
                        c: 'd',
                        e: 'f',
                    },
                    {
                        a: 'a',
                        b: 'b',
                        c: 'd',
                        e: 'd',
                    },
                ],
                x: [
                    {
                        a: 'z',
                        b: 'y',
                        c: 'x',
                        e: 'w',
                    },
                ],
            },
        },
    ]);

    it('has proper types', () => {
        enum TestEnum {
            First = 'first',
            Second = 'second',
        }

        const testEntries = [
            {
                a: 1,
                b: 'hello there',
            },
            {
                a: 2,
                b: 'good bye',
            },
            {
                a: 1,
                b: 'hello again',
            },
        ];

        assert
            .tsType(
                groupArrayBy(testEntries, (entry) => {
                    if (entry.a === 1) {
                        return TestEnum.First;
                    } else {
                        return TestEnum.Second;
                    }
                }),
            )
            .equals<Partial<Record<TestEnum, {a: number; b: string}[]>>>();
    });
});

describe(arrayToObject.name, () => {
    itCases(arrayToObject, [
        {
            it: 'handles an empty array',
            inputs: [
                [],
                (value) => {
                    return {
                        key: 'five',
                        value,
                    };
                },
            ],
            expect: {},
        },
        {
            it: 'handles an async callback',
            inputs: [
                ['value'],
                (value) => {
                    return Promise.resolve({
                        key: 'five',
                        value,
                    });
                },
            ],
            expect: {five: 'value'},
        },
        {
            it: 'filters out undefined async values',
            inputs: [
                [
                    true,
                    false,
                ],
                (value) => {
                    if (!value) {
                        return Promise.resolve(undefined);
                    }

                    return Promise.resolve({
                        key: 'five',
                        value,
                    });
                },
            ],
            expect: {five: true},
        },
        {
            it: 'handles a mix of sync and async values',
            inputs: [
                [
                    true,
                    false,
                ],
                (value) => {
                    if (value) {
                        return Promise.resolve({
                            key: 'async',
                            value,
                        });
                    } else {
                        return {
                            key: 'sync',
                            value,
                        };
                    }
                },
            ],
            expect: {
                sync: false,
                async: true,
            },
        },
        {
            it: 'filters out undefined sync values',
            inputs: [
                [
                    true,
                    false,
                ],
                (value) => {
                    if (!value) {
                        return undefined;
                    }

                    return {
                        key: 'five',
                        value,
                    };
                },
            ],
            expect: {five: true},
        },
        {
            it: 'handles an async callback error',
            inputs: [
                ['value'],
                () => {
                    return Promise.reject(new Error('reasons'));
                },
            ],
            throws: {
                matchMessage: 'reasons',
            },
        },
        {
            it: 'handles a sync callback error',
            inputs: [
                ['value'],
                () => {
                    throw new Error('reasons');
                },
            ],
            throws: {
                matchMessage: 'reasons',
            },
        },
        {
            it: 'handles no collisions',
            inputs: [
                [
                    {
                        a: 'b',
                        b: 'c',
                        c: 'd',
                        e: 'f',
                    },
                    {
                        a: 'a',
                        b: 'b',
                        c: 'c',
                        e: 'd',
                    },
                    {
                        a: 'z',
                        b: 'y',
                        c: 'x',
                        e: 'w',
                    },
                ],
                (value: any) => {
                    return {
                        key: value.c,
                        value,
                    };
                },
            ],
            expect: {
                d: {
                    a: 'b',
                    b: 'c',
                    c: 'd',
                    e: 'f',
                },
                c: {
                    a: 'a',
                    b: 'b',
                    c: 'c',
                    e: 'd',
                },
                x: {
                    a: 'z',
                    b: 'y',
                    c: 'x',
                    e: 'w',
                },
            },
        },
        {
            it: 'handles collisions',
            inputs: [
                [
                    {
                        a: 'b',
                        b: 'c',
                        c: 'd',
                        e: 'f',
                    },
                    {
                        a: 'a',
                        b: 'b',
                        c: 'd',
                        e: 'd',
                    },
                    {
                        a: 'z',
                        b: 'y',
                        c: 'x',
                        e: 'w',
                    },
                ],
                (value: any) => {
                    return {
                        key: value.c,
                        value,
                    };
                },
            ],
            expect: {
                d: {
                    a: 'a',
                    b: 'b',
                    c: 'd',
                    e: 'd',
                },
                x: {
                    a: 'z',
                    b: 'y',
                    c: 'x',
                    e: 'w',
                },
            },
        },
    ]);

    it('has proper types', () => {
        enum TestEnum {
            First = 'first',
            Second = 'second',
        }

        const testEntries = [
            {
                a: 1,
                b: 'hello there',
            },
            {
                a: 2,
                b: 'good bye',
            },
            {
                a: 1,
                b: 'hello again',
            },
        ];

        assert
            .tsType(
                arrayToObject(testEntries, (value) => {
                    if (value.a === 1) {
                        return {
                            key: TestEnum.First,
                            value,
                        };
                    } else {
                        return {
                            key: TestEnum.Second,
                            value,
                        };
                    }
                }),
            )
            .equals<Partial<Record<TestEnum, {a: number; b: string}>>>();
    });
});
