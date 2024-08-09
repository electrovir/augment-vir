import {describe, it, itCases} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
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

        assertTypeOf(
            groupArrayBy(testEntries, (entry) => {
                if (entry.a === 1) {
                    return TestEnum.First;
                } else {
                    return TestEnum.Second;
                }
            }),
        ).toEqualTypeOf<Partial<Record<TestEnum, {a: number; b: string}[]>>>();
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
                        value,
                        key: 'five',
                    };
                },
            ],
            expect: {},
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
                        value,
                        key: value.c,
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
                        value,
                        key: value.c,
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

        assertTypeOf(
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
        ).toEqualTypeOf<Partial<Record<TestEnum, {a: number; b: string}>>>();
    });
});
