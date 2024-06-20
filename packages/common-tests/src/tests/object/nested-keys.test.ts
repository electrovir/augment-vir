import {itCases} from '@augment-vir/chai';
import {
    AnyObject,
    NestedKeys,
    NestedSequentialKeys,
    NestedValue,
    copyThroughJson,
    getValueFromNestedKeys,
    randomString,
    setValueWithNestedKeys,
} from '@augment-vir/common';
import {assert} from 'chai';
import {describe} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

type ExampleObjectType = {
    topLevel: string;
    oneLevelDeep: {
        singleNestedProp: number;
    };
    threeLevelsDeep: {
        nestedOne: {
            nestedTwo: {
                nestedThree: {
                    propOne: RegExp;
                    propTwo: Date | undefined;
                };
            };
        };
    };
};

describe(setValueWithNestedKeys.name, () => {
    const exampleOriginal = {
        a: {
            b: {
                c: 3,
            },
        },
    };

    it('sets a value deeply', () => {
        const newValue = Math.random();

        setValueWithNestedKeys(
            exampleOriginal,
            [
                'a',
                'b',
                'c',
            ],
            newValue,
        );

        assert.deepStrictEqual(exampleOriginal, {
            a: {
                b: {
                    c: newValue,
                },
            },
        });
    });

    it("creates keys that didn't exist", () => {
        const missingKeys = {} as typeof exampleOriginal;
        const newValue = Math.random();

        setValueWithNestedKeys(
            missingKeys,
            [
                'a',
                'b',
                'c',
            ],
            newValue,
        );

        assert.deepStrictEqual(missingKeys, {
            a: {
                b: {
                    c: newValue,
                },
            },
        });
    });
    it('should set a value', () => {
        const myObject = {
            a: 'hi',
            b: {
                c: 'hello',
                d: {
                    e: 'super deep',
                },
            },
        };

        const newValue = randomString();

        setValueWithNestedKeys(
            myObject,
            [
                'b',
                'd',
                'e',
            ],
            newValue,
        );

        assert.deepStrictEqual(myObject, {
            a: 'hi',
            b: {
                c: 'hello',
                d: {
                    e: newValue,
                },
            },
        });
    });
    it('sets a value only one key deep', () => {
        const myObject = {
            a: 'hi',
        };

        const newValue = randomString();

        setValueWithNestedKeys(
            myObject,
            [
                'a',
            ],
            newValue,
        );

        assert.deepStrictEqual(myObject, {
            a: newValue,
        });
    });
    it('sets a value in an object without any keys', () => {
        const myObject = {} as Partial<{a: string}>;

        const newValue = randomString();

        setValueWithNestedKeys(
            myObject,
            [
                'a',
            ],
            newValue,
        );

        assert.deepStrictEqual(myObject, {
            a: newValue,
        });
    });
    it('does nothing with no keys', () => {
        const myObject = {
            a: 'hi',
            b: {
                c: 'hello',
                d: {
                    e: 'super deep',
                },
            },
        };
        const originalObject = copyThroughJson(myObject);

        const newValue = randomString();

        setValueWithNestedKeys(
            myObject,
            // @ts-expect-error: intentionally leave empty
            [],
            newValue,
        );

        assert.deepStrictEqual(myObject, originalObject);
    });
});

describe('NestedSequentialKeys', () => {
    it('does not crash on primitive arrays', () => {
        assertTypeOf<NestedSequentialKeys<ReadonlyArray<string>>>().toEqualTypeOf<[number]>();
    });

    it('is not infinite', () => {
        type TestType<
            MyParam extends AnyObject,
            KeyPath extends NestedSequentialKeys<MyParam>,
        > = NestedSequentialKeys<MyParam>;
    });
});

describe('NestedKeys', () => {
    it('should restrict types', () => {
        const exampleObjectInstance: NestedSequentialKeys<ExampleObjectType> = {} as any;

        assertTypeOf<[]>().not.toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['topLevel']>().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['oneLevelDeep']>().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['oneLevelDeep', 'oneLevelDeep']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['oneLevelDeep', 'topLevel']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['oneLevelDeep', 'singleNestedProp']>().toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();

        assertTypeOf<['oneLevelDeep', 'nestedOne']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['threeLevelsDeep']>().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['threeLevelsDeep', 'nestedOne']>().toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['threeLevelsDeep', 'nestedTwo']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<
            ['threeLevelsDeep', 'nestedOne', 'nestedTwo', 'nestedThree', 'propOne']
        >().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<
            ['threeLevelsDeep', 'nestedOne', 'nestedTwo', 'nestedThree', 'propTwo']
        >().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<
            ['threeLevelsDeep', 'nestedOne', 'nestedTwo', 'nestedThree', 'derp']
        >().not.toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<
            ['threeLevelsDeep', 'singleNestedProp', 'nestedTwo', 'nestedThree']
        >().not.toBeAssignableTo(exampleObjectInstance);

        type NftExtraData = {
            nftId: string;
            offers: ReadonlyArray<{derp: string}>;
            listing:
                | {
                      price: number;
                      locked: boolean | number[];
                  }
                | undefined;
        };

        type SortDefinition<EntryGeneric extends object> = {
            sortName: string;
            sortField: NestedSequentialKeys<EntryGeneric>;
        };

        const keys: SortDefinition<NftExtraData> = {
            sortField: ['listing'],
            sortName: 'derp',
        };
    });

    it('is not infinite', () => {
        type TestType<
            MyParam extends AnyObject,
            KeyPath extends NestedKeys<MyParam>,
        > = NestedKeys<MyParam>;
    });

    it('works through arrays', () => {
        type ParentType = {
            stuff: {hello: string};
            multiple: {moreStuff: {nested: number}}[];
        };

        const nestedKeys: NestedKeys<ParentType> = [
            'multiple',
            'moreStuff',
            'nested',
        ];
    });

    it('should allow unions', () => {
        assertTypeOf<ExampleObjectType['topLevel' | 'oneLevelDeep']>().toEqualTypeOf<
            string | ExampleObjectType['oneLevelDeep']
        >();

        assertTypeOf<['topLevel' | 'threeLevelsDeep']>().toBeAssignableTo<
            NestedKeys<ExampleObjectType>
        >();

        assertTypeOf<['oneLevelDeep' | 'threeLevelsDeep', 'nestedOne']>().toBeAssignableTo<
            NestedKeys<ExampleObjectType>
        >();
    });
});

describe('NestedValue', () => {
    it('is not infinite', () => {
        type TestType<
            MyParam extends AnyObject,
            KeyPath extends NestedSequentialKeys<MyParam>,
            MyValue extends NestedValue<MyParam, KeyPath>,
        > = unknown;
    });
});

describe(getValueFromNestedKeys.name, () => {
    it('should restrict types properly', () => {
        const example: ExampleObjectType = {} as any;

        assertTypeOf(getValueFromNestedKeys(example, ['topLevel'])).toEqualTypeOf<string>();

        const derp: NestedSequentialKeys<ExampleObjectType> = ['topLevel'];

        assertTypeOf<['topLevel']>().toBeAssignableTo<NestedSequentialKeys<ExampleObjectType>>();

        assertTypeOf<['']>().not.toBeAssignableTo<NestedSequentialKeys<ExampleObjectType>>();

        getValueFromNestedKeys(example, [
            // @ts-expect-error
            '',
        ]);

        const value = getValueFromNestedKeys(example, [
            'threeLevelsDeep',
            'nestedOne',
            'nestedTwo',
            'nestedThree',
            'propTwo',
        ]);

        assertTypeOf(
            getValueFromNestedKeys(example, [
                'threeLevelsDeep',
                'nestedOne',
                'nestedTwo',
                'nestedThree',
                'propTwo',
            ]),
        ).toEqualTypeOf<Date | undefined>();
    });

    it('works through arrays', () => {
        const output = getValueFromNestedKeys(
            {
                stuff: {hello: 'hi'},
                multiple: [{moreStuff: {nested: 5}}],
            },
            [
                'multiple',
                'moreStuff',
                'nested',
            ],
        );

        assertTypeOf(output).toEqualTypeOf<5[]>();
        assert.deepStrictEqual(output, [5]);
    });

    const testObject = {
        topLevelValue: randomString(),
        topLevelObject: {
            nestedTwo: randomString(),
            nestedAgain: {
                tripleNested: randomString(),
            },
        },
    } as const;

    itCases(
        (keys: NestedSequentialKeys<typeof testObject>) => getValueFromNestedKeys(testObject, keys),
        [
            {
                it: 'should return the correct top level value',
                input: ['topLevelObject'],
                expect: testObject.topLevelObject,
            },
            {
                it: 'should return undefined if key is missing',
                input: ['missing key' as any],
                expect: undefined as any,
            },
            {
                it: 'should get the value from nested keys',
                input: [
                    'topLevelObject',
                    'nestedAgain',
                    'tripleNested',
                ],
                expect: testObject.topLevelObject.nestedAgain.tripleNested,
            },
        ],
    );
});
