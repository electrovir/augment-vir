import {itCases} from '@augment-vir/chai';
import {
    arrayToObject,
    filterOutIndexes,
    flatten2dArray,
    groupArrayBy,
    repeatArray,
    trimArrayStrings,
    typedArrayIncludes,
} from '@augment-vir/common';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

describe(filterOutIndexes.name, () => {
    const experimentArray = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
    ];

    it('removes array indexes', () => {
        expect(
            filterOutIndexes(
                experimentArray,
                [
                    1,
                    4,
                    5,
                    6,
                ],
            ),
        ).to.deep.equal([
            'a',
            'c',
            'd',
        ]);
    });

    it('does not modify the original array', () => {
        filterOutIndexes(
            experimentArray,
            [
                1,
                4,
                5,
                6,
            ],
        );
        expect(experimentArray).to.deep.equal([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
        ]);
    });

    it("doesn't do anything if no indexes are given to remove", () => {
        expect(filterOutIndexes(experimentArray, [])).to.deep.equal(experimentArray);
    });
});

describe(trimArrayStrings.name, () => {
    it('white space is removed', () => {
        expect(
            trimArrayStrings(
                `
                    who is this
                    what do you want
                    hello there
                    
                    
                `.split('\n'),
            ),
        ).to.deep.equal([
            'who is this',
            'what do you want',
            'hello there',
        ]);
    });
});

describe(flatten2dArray.name, () => {
    it('array ordering is preserved and collapsed', () => {
        expect(
            flatten2dArray([
                [
                    1,
                    2,
                    3,
                ],
                [
                    4,
                    5,
                    6,
                    0,
                ],
                [
                    7,
                    8,
                    9,
                ],
                [10],
                [
                    11,
                    12,
                ],
                [
                    21,
                    22,
                    22,
                    1,
                    0,
                    -1,
                ],
            ]),
        ).to.deep.equal([
            1,
            2,
            3,
            4,
            5,
            6,
            0,
            7,
            8,
            9,
            10,
            11,
            12,
            21,
            22,
            22,
            1,
            0,
            -1,
        ]);
    });
});

describe(typedArrayIncludes.name, () => {
    itCases(typedArrayIncludes, [
        {
            it: 'should work for string array',
            expect: true,
            inputs: [
                [
                    'hello',
                    'there',
                ],
                'there',
            ],
        },
    ]);

    it('should be a general type guard', () => {
        const array = [
            'yo',
            'hello',
            'hi',
        ];

        const vagueVar: number | string = 'yo' as number | string;

        if (typedArrayIncludes(array, vagueVar)) {
            const definitelyString: string = vagueVar;
        }
    });

    it('should be a super narrow type guard', () => {
        const array = [
            'yo',
            'hello',
            'hi',
        ] as const;

        const vagueVar: number | string = 'yo' as number | string;

        if (typedArrayIncludes(array, vagueVar)) {
            assertTypeOf(vagueVar).toEqualTypeOf<'yo' | 'hello' | 'hi'>();
        }
    });
});

describe(repeatArray.name, () => {
    itCases(repeatArray, [
        {
            it: 'does nothing with an empty array',
            inputs: [
                5,
                [],
            ],
            expect: [],
        },
        {
            it: 'repeats the given array',
            inputs: [
                5,
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: [
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
            ],
        },
        {
            it: 'works with a decimal repeat value',
            inputs: [
                2.5,
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: [
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
            ],
        },
    ]);

    it('returns a new array', () => {
        const originalArray = [
            'a',
            'b',
            'c',
        ];
        const repeatedArray = repeatArray(2, originalArray);

        assert.isFalse(repeatedArray === originalArray);
        assert.notDeepEqual(repeatedArray, originalArray);
    });
});

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
        ).toEqualTypeOf<Record<TestEnum, {a: number; b: string}[]>>();
    });
});

describe(arrayToObject.name, () => {
    itCases(arrayToObject, [
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
                (entry: any) => {
                    return entry.c;
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
                (entry: any) => {
                    return entry.c;
                },
            ],
            expect: {
                d: {
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
            arrayToObject(testEntries, (entry) => {
                if (entry.a === 1) {
                    return TestEnum.First;
                } else {
                    return TestEnum.Second;
                }
            }),
        ).toEqualTypeOf<Record<TestEnum, {a: number; b: string}>>();
    });
});
