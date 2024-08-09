import {assert, describe, it, itCases} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {getEnumValues} from '../enum/enum-values.js';
import {
    getEntriesSortedByKey,
    getObjectTypedEntries,
    typedObjectFromEntries,
} from './object-entries.js';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(getObjectTypedEntries.name, () => {
    itCases(getObjectTypedEntries, [
        {
            it: 'handles an empty object',
            input: {},
            expect: [],
        },
        {
            it: 'gets entries',
            input: {
                hi: 'bye',
                what: 4,
            },
            expect: [
                [
                    'hi',
                    'bye',
                ],
                [
                    'what',
                    4,
                ],
            ],
        },
    ]);

    it('merges all entries into unions', () => {
        const exampleObject = {
            hi: 'hi',
            bye: 5,
            somethingElse: /regexp/,
        };

        assertTypeOf(getObjectTypedEntries(exampleObject)).toEqualTypeOf<
            ['bye' | 'hi' | 'somethingElse', string | number | RegExp][]
        >();
    });

    it('handles optional properties', () => {
        const example = {} as Partial<Record<Planet, string>>;

        assertTypeOf(getObjectTypedEntries(example)).toEqualTypeOf<[Planet, string][]>();

        const example2 = {} as Partial<{
            [x in string]: RegExp;
        }>;

        assertTypeOf(getObjectTypedEntries(example2)).toEqualTypeOf<[string, RegExp][]>();
    });

    it('handles nullable properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string | undefined>>;

        assertTypeOf(getObjectTypedEntries(exampleObject)).toEqualTypeOf<
            [Planet, string | undefined][]
        >();
    });

    it('includes optional properties in object values', () => {
        const exampleObject = {} as Record<
            string,
            {
                label: string;
                description: string;
                deps?: string[] | undefined;
                hideFromUsers?: boolean | undefined;
            }
        >;

        const entries = getObjectTypedEntries(exampleObject);

        assertTypeOf(entries).toEqualTypeOf<
            [
                string,
                {
                    label: string;
                    description: string;
                    deps?: string[] | undefined;
                    hideFromUsers?: boolean | undefined;
                },
            ][]
        >();
    });
    it('includes optional properties in object values', () => {
        const exampleObject = {} as Record<
            string,
            {
                label: string;
                description: string;
                deps?: string[] | undefined;
                hideFromUsers?: boolean | undefined;
            }
        >;

        const entries = getObjectTypedEntries(exampleObject);

        assertTypeOf(entries).toEqualTypeOf<
            [
                string,
                {
                    label: string;
                    description: string;
                    deps?: string[] | undefined;
                    hideFromUsers?: boolean | undefined;
                },
            ][]
        >();
    });
});

describe(typedObjectFromEntries.name, () => {
    it('should maintain types', () => {
        enum MyEnum {
            aKey = 'a',
            bKey = 'b',
        }

        const entries = getEnumValues(MyEnum).map((enumValue): [MyEnum, string] => {
            return [
                enumValue,
                `${enumValue}-derp`,
            ];
        });

        const formedObject = typedObjectFromEntries(entries);

        assertTypeOf(formedObject).toEqualTypeOf<Record<MyEnum, string>>();

        assert.deepStrictEqual(formedObject, {
            [MyEnum.aKey]: 'a-derp',
            [MyEnum.bKey]: 'b-derp',
        });
    });
});

describe(getEntriesSortedByKey.name, () => {
    it("gets entries in order even if they're not assigned in order", () => {
        const testObjectA: Record<string, number> = {
            a: 2,
            b: 5,
            q: 9,
            d: 3,
            c: 4,
        };

        assert.deepStrictEqual(getEntriesSortedByKey(testObjectA), [
            [
                'a',
                2,
            ],
            [
                'b',
                5,
            ],
            [
                'c',
                4,
            ],
            [
                'd',
                3,
            ],
            [
                'q',
                9,
            ],
        ]);

        testObjectA.aaa = 6;

        assert.deepStrictEqual(getEntriesSortedByKey(testObjectA), [
            [
                'a',
                2,
            ],
            [
                'aaa',
                6,
            ],
            [
                'b',
                5,
            ],
            [
                'c',
                4,
            ],
            [
                'd',
                3,
            ],
            [
                'q',
                9,
            ],
        ]);
    });
});
