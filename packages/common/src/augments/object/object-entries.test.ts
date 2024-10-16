import {assert} from '@augment-vir/assert';
import {getEnumValues} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
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

        assert
            .tsType(getObjectTypedEntries(exampleObject))
            .equals<['bye' | 'hi' | 'somethingElse', string | number | RegExp][]>();
    });

    it('handles optional properties', () => {
        const example = {} as Partial<Record<Planet, string>>;

        assert.tsType(getObjectTypedEntries(example)).equals<[Planet, string][]>();

        const example2 = {} as Partial<{
            [x in string]: RegExp;
        }>;

        assert.tsType(getObjectTypedEntries(example2)).equals<[string, RegExp][]>();
    });

    it('handles nullable properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string | undefined>>;

        assert
            .tsType(getObjectTypedEntries(exampleObject))
            .equals<[Planet, string | undefined][]>();
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

        assert.tsType(entries).equals<
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

        assert.tsType(entries).equals<
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

        assert.tsType(formedObject).equals<Record<MyEnum, string>>();

        assert.deepEquals(formedObject, {
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

        assert.deepEquals(getEntriesSortedByKey(testObjectA), [
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

        assert.deepEquals(getEntriesSortedByKey(testObjectA), [
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
