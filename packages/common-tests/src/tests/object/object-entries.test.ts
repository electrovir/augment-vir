import {itCases} from '@augment-vir/chai';
import {
    getEntriesSortedByKey,
    getEnumTypedValues,
    getObjectTypedEntries,
    getObjectTypedKeys,
    getObjectTypedValues,
    isKeyof,
    typedObjectFromEntries,
} from '@augment-vir/common';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

const greekNames: Record<Planet, string> = {
    [Planet.Mercury]: 'Hermes',
    [Planet.Venus]: 'Aphrodite',
    [Planet.Earth]: 'Earth',
};

describe(isKeyof.name, () => {
    const exampleSymbol = Symbol('example');

    it('should be a type guard', () => {
        const exampleObject = {
            thing: 2,
            what: 1,
        } as const;

        const exampleKey: PropertyKey = 'thing' as PropertyKey;
        assertTypeOf(exampleKey).not.toEqualTypeOf<keyof typeof exampleObject>();

        if (isKeyof(exampleKey, exampleObject)) {
            assertTypeOf(exampleKey).toEqualTypeOf<keyof typeof exampleObject>();
        }

        assertTypeOf(exampleKey).not.toEqualTypeOf<keyof typeof exampleObject>();
    });

    itCases(isKeyof, [
        {
            it: 'should handle missing empty string key',
            inputs: [
                '',
                {},
            ],
            expect: false,
        },
        {
            it: 'should handle existing empty string key',
            inputs: [
                '',
                {'': 'is this even possible'},
            ],
            expect: true,
        },
        {
            it: 'should handle numeric key',
            inputs: [
                5,
                {5: 'value'},
            ],
            expect: true,
        },
        {
            it: 'should handle a symbol key',
            inputs: [
                exampleSymbol,
                {[exampleSymbol]: 'value'},
            ],
            expect: true,
        },
        {
            it: 'should fail on missing key',
            inputs: [
                'not there',
                {stuff: 2, moreStuff: 4},
            ],
            expect: false,
        },
    ]);
});

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

describe(getObjectTypedKeys.name, () => {
    it('gets basic object keys', () => {
        expect(getObjectTypedKeys(greekNames)).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });

    it('falls back to using Object.keys', () => {
        assert.isEmpty(getObjectTypedKeys(String('')));
    });

    it('includes symbols', () => {
        const mySymbol = Symbol('derp');

        expect(getObjectTypedKeys({[mySymbol]: 'nothing', ...greekNames})).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
            mySymbol,
        ]);
    });
});

describe(getObjectTypedValues.name, () => {
    itCases(getObjectTypedValues, [
        {
            it: 'gets basic values',
            input: greekNames,
            expect: [
                greekNames[Planet.Mercury],
                greekNames[Planet.Venus],
                greekNames[Planet.Earth],
            ],
        },
        {
            it: 'does something with non-objects',
            input: 'hello there',
            expect: [
                'h',
                'e',
                'l',
                'l',
                'o',
                ' ',
                't',
                'h',
                'e',
                'r',
                'e',
            ],
        },
    ]);

    it('handles optional properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string>>;

        assertTypeOf(getObjectTypedValues(exampleObject)).toEqualTypeOf<string[]>();

        const example2 = {} as Partial<{
            [x in string]: RegExp;
        }>;

        assertTypeOf(getObjectTypedValues(example2)).toEqualTypeOf<RegExp[]>();
    });

    it('handles nullable properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string | undefined>>;

        assertTypeOf(getObjectTypedValues(exampleObject)).toEqualTypeOf<(string | undefined)[]>();
    });
});

describe(getEntriesSortedByKey.name, () => {
    it("should get entries in order even if they're not assigned in order", () => {
        const testObjectA: Record<string, number> = {
            a: 2,
            b: 5,
            q: 9,
            d: 3,
            c: 4,
        };

        expect(getEntriesSortedByKey(testObjectA)).to.deep.equal([
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

        expect(getEntriesSortedByKey(testObjectA)).to.deep.equal([
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

describe(typedObjectFromEntries.name, () => {
    it('should maintain types', () => {
        enum MyEnum {
            aKey = 'a',
            bKey = 'b',
        }

        const entries = getEnumTypedValues(MyEnum).map((enumValue): [MyEnum, string] => {
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
