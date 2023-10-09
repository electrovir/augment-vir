import {assertTypeOf, itCases} from '@augment-vir/chai';
import {
    NestedKeys,
    NestedSequentialKeys,
    getValueFromNestedKeys,
    randomString,
    setValueWithNestedKeys,
} from '@augment-vir/common';
import {assert} from 'chai';
import {describe} from 'mocha';

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
                    propTwo: Date;
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

        assert.strictEqual(exampleOriginal.a.b.c, newValue);
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

        assert.strictEqual(missingKeys.a.b.c, newValue);
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
});

describe('NestedAnyKeys', () => {
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

describe('getValueFromNestedKeys', () => {
    it('should restrict types properly', () => {
        const example: ExampleObjectType = {} as any;

        assertTypeOf(getValueFromNestedKeys(example, ['topLevel'])).toEqualTypeOf<
            string | undefined
        >();

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
                expect: undefined,
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
