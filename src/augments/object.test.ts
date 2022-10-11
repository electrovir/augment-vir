import {expect} from 'chai';
import {describe, it} from 'mocha';
import {itCases} from './chai-only/assert-output';
import {
    areJsonEqual,
    assertMatchesObjectShape,
    copyThroughJson,
    filterToEnumValues,
    getEntriesSortedByKey,
    getEnumTypedKeys,
    getEnumTypedValues,
    getObjectTypedKeys,
    getObjectTypedValues,
    isEnumValue,
    isObject,
    mapObject,
    ObjectValueType,
    ObjectWithAtLeastSingleEntryArrays,
    typedHasProperties,
    typedHasProperty,
} from './object';
import {isPromiseLike} from './promise';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(getEnumTypedKeys.name, () => {
    it('gets basic enum keys properly', () => {
        expect(getEnumTypedKeys(Planet)).to.deep.equal([
            'Mercury',
            'Venus',
            'Earth',
        ]);
    });

    it('enum keys can be used to access the enum', () => {
        const keys = getEnumTypedKeys(Planet);
        expect(keys.map((key) => Planet[key])).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });
});

describe(getEnumTypedValues.name, () => {
    it('gets basic enum values properly', () => {
        expect(getEnumTypedValues(Planet)).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });
});

describe(isEnumValue.name, () => {
    const testEnumValues = [
        Planet.Mercury,
        Planet.Venus,
        Planet.Earth,
        'moon',
        'luna',
        'not a planet',
    ];

    it('matches all correct enum values', () => {
        expect(testEnumValues.filter((testValue) => isEnumValue(testValue, Planet))).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });
});

const greekNames: Record<Planet, string> = {
    [Planet.Mercury]: 'Hermes',
    [Planet.Venus]: 'Aphrodite',
    [Planet.Earth]: 'Earth',
};

describe(getObjectTypedKeys.name, () => {
    it('gets basic object keys', () => {
        expect(getObjectTypedKeys(greekNames)).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
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
    it('gets basic object values', () => {
        expect(getObjectTypedValues(greekNames)).to.deep.equal([
            greekNames[Planet.Mercury],
            greekNames[Planet.Venus],
            greekNames[Planet.Earth],
        ]);
    });
});

describe(filterToEnumValues.name, () => {
    enum TestEnum {
        A = 'a',
        B = 'b',
        C = 'c',
    }

    it('empty input results in empty output', () => {
        expect(filterToEnumValues([], TestEnum)).to.deep.equal([]);
    });

    it('excludes invalid enum values', () => {
        expect(
            filterToEnumValues(
                [
                    'derby',
                    'who',
                    'done',
                    'it',
                ],
                TestEnum,
            ),
        ).to.deep.equal([]);
    });

    const validValuesTest = [
        TestEnum.A,
        TestEnum.B,
        TestEnum.C,
    ];

    it('includes valid enum values', () => {
        expect(filterToEnumValues(validValuesTest, TestEnum)).to.deep.equal(validValuesTest);
    });

    it('works with case insensitivity', () => {
        expect(
            filterToEnumValues(
                [
                    'MeRcUrY',
                    'vEnUs',
                    'EARth',
                    'MOON',
                    'luNA',
                    'not A planET',
                ],
                Planet,
                true,
            ),
        ).to.deep.equal([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });

    it("does not do case insensitivity when it's not explicitly turned on", () => {
        expect(
            filterToEnumValues(
                [
                    'MeRcUrY',
                    Planet.Venus,
                    'EARth',
                    'MOON',
                    'luNA',
                    'not A planET',
                ],
                Planet,
            ),
        ).to.deep.equal([Planet.Venus]);
    });

    it('output order matches input order', () => {
        expect(
            filterToEnumValues(
                [
                    'what',
                    TestEnum.C,
                    'who',
                    'where',
                    'why',
                    TestEnum.B,
                    TestEnum.A,
                ],
                TestEnum,
            ),
        ).to.deep.equal([
            TestEnum.C,
            TestEnum.B,
            TestEnum.A,
        ]);
    });
});

describe(typedHasProperty.name, () => {
    const testObject = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
    };

    const testCases: {input: any; property: string; output: boolean}[] = [
        {
            input: testObject,
            property: 'a',
            output: true,
        },
        {
            input: testObject,
            property: 'b',
            output: true,
        },
        {
            input: testObject,
            property: 'blah',
            output: false,
        },
        {
            input: () => {},
            property: 'name',
            output: true,
        },
    ];

    it('should pass all test cases', () => {
        testCases.forEach((testCase) => {
            const message = `Expected property ${testCase.property} to ${
                testCase.output ? '' : 'not '
            }exist.`;
            try {
                expect(typedHasProperty(testCase.input, testCase.property)).to.equal(
                    testCase.output,
                );
            } catch (error) {
                console.error(message);
                throw error;
            }
        });
    });

    it('should properly be able to access a property after checking it exists', () => {
        const idkWhatThisIs: unknown = (() => {}) as unknown;
        if (typedHasProperty(idkWhatThisIs, 'name')) {
            idkWhatThisIs.name;
        } else {
            // @ts-expect-error
            idkWhatThisIs.name;
        }
    });

    it('should preserve property value type when it exists', () => {
        const whatever = {} as {name: string} | string;

        // should not be able to access the property directly
        // @ts-expect-error
        whatever.name;

        if (typedHasProperty(whatever, 'name')) {
            whatever.name;

            const onlyStrings: string = whatever.name;
        }
    });

    it('should enforce that an optional property exists', () => {
        const whatever = {} as {name?: string};

        // should be able to access the property directly
        const maybeUndefined: string | undefined = whatever.name;
        // @ts-expect-error
        const failsDefinedOnly: string = whatever.name;

        if (typedHasProperty(whatever, 'name')) {
            whatever.name;

            const onlyString: string = whatever.name;
        }
    });

    it('should work with generics', () => {
        function isPromiseLike<T>(input: T) {
            if (typedHasProperty(input, 'then')) {
                input.then;
            }
        }
    });
});

describe(typedHasProperties.name, () => {
    const testObject = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
    };

    it('should correctly test existing properties', () => {
        expect(
            typedHasProperties(testObject, [
                'a',
                'b',
                'c',
                'd',
                'e',
            ]),
        ).to.equal(true);
    });

    it('should correctly fail on nonexisting properties', () => {
        expect(
            typedHasProperties(testObject, [
                'abba',
                'blah',
                'cookie',
                'derp',
                'ear',
            ]),
        ).to.equal(false);
    });

    it('should pass type checks', () => {
        const whatever = {} as {name: string} | string;

        // should not be able to access the property directly
        // @ts-expect-error
        whatever.name;

        if (
            typedHasProperties(whatever, [
                'name',
                // 'value',
            ])
        ) {
            whatever.name;
            // @ts-expect-error
            whatever.value;

            const onlyStrings: string = whatever.name;
        }
        if (
            typedHasProperties(whatever, [
                'name',
                'value',
            ])
        ) {
            whatever.name;
            whatever.value;

            const onlyStrings: string = whatever.name;
        }

        type MaybePromise<T> =
            | (T extends Promise<infer ValueType> ? T | ValueType : Promise<T> | T)
            | undefined
            | {error: Error};

        const maybePromise = {} as MaybePromise<number>;

        if (isPromiseLike(maybePromise)) {
            const myPromise: PromiseLike<number> = maybePromise;
        } else if (typedHasProperty(maybePromise, 'error')) {
            const myError: Error = maybePromise.error;
        } else {
            maybePromise;
        }
    });
});

describe(isObject.name, () => {
    it('should pass on empty object', () => {
        expect(isObject({})).to.equal(true);
    });

    it('should pass on filled in object', () => {
        expect(isObject({a: '4', b: '5'})).to.equal(true);
    });

    it('should fail on null', () => {
        expect(isObject(null)).to.equal(false);
    });

    it('should fail on function', () => {
        expect(isObject(() => {})).to.equal(false);
    });

    it('should fail on other non-objects', () => {
        const testingItems = [
            5,
            '5',
        ];

        expect(testingItems.some(isObject)).to.equal(false);
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

describe(areJsonEqual.name, () => {
    it('should pass for different object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };
        const objectB: Record<string, number> = {
            a: 1,
            b: 2,
            c: 3,
        };

        objectA.b = 2;

        expect(areJsonEqual(objectA, objectB)).to.equal(true);
    });

    it('should pass for same object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };

        expect(areJsonEqual(objectA, objectA)).to.equal(true);
    });

    it('should not pass if objects are different', () => {
        const objectA: Record<string, number> = {
            a: 1,
            b: 2.1,
            c: 3,
        };
        const objectB: Record<string, number> = {
            a: 1,
            b: 2,
            c: 3,
        };

        expect(areJsonEqual(objectA, objectB)).to.equal(false);
        expect(areJsonEqual({...objectA, b: 2}, objectB)).to.equal(true);
    });
});

describe(copyThroughJson.name, () => {
    it('should create an identical copy', () => {
        const testObjectA = {a: 5, b: 'five', c: {d: 5}, e: [6]};

        expect(copyThroughJson(testObjectA)).to.deep.equal(testObjectA);
    });
});

describe('ObjectValueType', () => {
    it('should pass type checking', () => {
        type TestType = {a: number; b: string};

        const testObjectA: TestType = {a: 5, b: 'five'};
        const testValueC = testObjectA.a;
        let testAssign: ObjectValueType<TestType> = testObjectA.a;
        testAssign = testObjectA.b;
        // @ts-expect-error
        testAssign = [5];
        testAssign = testValueC;

        expect(testAssign).to.deep.equal(testObjectA.a);
    });
});

describe(mapObject.name, () => {
    function onlyAcceptNumbers(input: number): void {}
    function onlyAcceptStrings(input: string): void {}

    it("should map an object's values", () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        // type tests
        onlyAcceptNumbers(originalObject.a);
        // @ts-expect-error
        onlyAcceptStrings(originalObject.a);

        const mappedObject = mapObject(originalObject, (key, value) => {
            return String(value);
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;

        expect(getObjectTypedKeys(originalObject)).to.deep.equal(getObjectTypedKeys(mappedObject));

        getObjectTypedKeys(originalObject).forEach((key) => {
            expect(originalObject.hasOwnProperty(key)).to.equal(true);
            expect(mappedObject.hasOwnProperty(key)).to.equal(true);

            expect(Number(mappedObject[key])).to.deep.equal(originalObject[key]);
            expect(String(originalObject[key])).to.deep.equal(mappedObject[key]);
        });
    });

    it('should work with promises', async () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        const mappedObject = mapObject(originalObject, async (key, value) => {
            return Promise.resolve(String(value));
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        // @ts-expect-error
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;

        const awaitedMappedObject = await mappedObject;

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(awaitedMappedObject.a);
        onlyAcceptStrings(awaitedMappedObject.a);
        // @ts-expect-error
        awaitedMappedObject.q;

        expect(getObjectTypedKeys(originalObject)).to.deep.equal(
            getObjectTypedKeys(awaitedMappedObject),
        );

        getObjectTypedKeys(originalObject).forEach((key) => {
            expect(originalObject.hasOwnProperty(key)).to.equal(true);
            expect(awaitedMappedObject.hasOwnProperty(key)).to.equal(true);

            expect(Number(awaitedMappedObject[key])).to.deep.equal(originalObject[key]);
            expect(String(originalObject[key])).to.deep.equal(awaitedMappedObject[key]);
        });
    });

    it('should preserve properties with complex value types', () => {
        const originalObject = {
            a: 1,
            b: {what: 'two'},
            c: '3',
            d: 4,
            e: 5,
        };

        // type tests
        onlyAcceptNumbers(originalObject.a);
        // @ts-expect-error
        onlyAcceptNumbers(originalObject.b);
        // @ts-expect-error
        onlyAcceptNumbers(originalObject.c);
        // @ts-expect-error
        onlyAcceptStrings(originalObject.a);

        const mappedObject = mapObject(originalObject, (key, value) => {
            return String(value);
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.b);
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.c);
        onlyAcceptStrings(mappedObject.b);
        onlyAcceptStrings(mappedObject.c);
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;
    });
});

describe(assertMatchesObjectShape.name, () => {
    it('should require a generic to be provided', () => {
        // @ts-expect-error
        assertMatchesObjectShape({}, {});
        assertMatchesObjectShape<{}>({}, {});
    });

    it('should require array properties to have at least one entry', () => {
        type WithArrayProp = {
            five: number;
            arrayProp: string[];
        };
        const shouldNormallyBeAllowedWithoutEntries: WithArrayProp = {
            five: 3,
            arrayProp: [],
        };

        assertMatchesObjectShape<WithArrayProp>(shouldNormallyBeAllowedWithoutEntries, {
            five: 3,
            // @ts-expect-error
            arrayProp: [],
        });
        assertMatchesObjectShape<WithArrayProp>(shouldNormallyBeAllowedWithoutEntries, {
            five: 3,
            arrayProp: ['hello'],
        });
        assertMatchesObjectShape<WithArrayProp>(shouldNormallyBeAllowedWithoutEntries, {
            five: 3,

            arrayProp: [
                // @ts-expect-error
                4,
            ],
        });
    });

    itCases(assertMatchesObjectShape<any>, [
        {
            description: 'should match with unequal values',
            inputs: [
                {
                    a: 'derp',
                    b: 0,
                },
                {
                    a: '',
                    b: Infinity,
                },
            ],
            throws: undefined,
        },
        {
            description: 'should be okay with array props that are empty',
            inputs: [
                {
                    a: 'derp',
                    b: [],
                },
                {
                    a: '',
                    b: ['a'],
                },
            ],
            throws: undefined,
        },
        {
            description: 'should pass on valid array values',
            inputs: [
                {
                    a: 'derp',
                    b: ['a'],
                },
                {
                    a: '',
                    b: ['a'],
                },
            ],
            throws: undefined,
        },
        {
            description: 'should fail on invalid array values',
            inputs: [
                {
                    a: 'derp',
                    b: [
                        '2',
                        4,
                    ],
                },
                {
                    a: '',
                    b: ['a'],
                },
            ],
            throws: 'entry at index "1" did not match expected shape: test object value at key "b" did not match expected shape: type "number" did not match expected type "string"',
        },
        {
            description: 'should check against all possible array types',
            inputs: [
                {
                    a: 'derp',
                    b: [
                        '2',
                        4,
                    ],
                },
                {
                    a: '',
                    b: [
                        'a',
                        4,
                    ],
                },
            ],
            throws: undefined,
        },
        {
            description: 'should not match with mismatched types',
            inputs: [
                {
                    a: 42,
                    b: 0,
                },
                {
                    a: '',
                    b: Infinity,
                },
            ],
            throws: 'test object value at key "a" did not match expected shape: type "number" did not match expected type "string"',
        },
        {
            description: 'should not match with an extra property',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: 52,
                },
                {
                    a: 99,
                    b: Infinity,
                },
            ],
            throws: 'Test object has extra keys: c',
        },
        {
            description: 'should match with an extra property when its allowed',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: 52,
                },
                {
                    a: 99,
                    b: Infinity,
                },
                true,
            ],
            throws: undefined,
        },
        {
            description: 'should match with nested properties',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: {
                        nested: {
                            five: 4,
                        },
                    },
                },
                {
                    a: 99,
                    b: Infinity,
                    c: {
                        nested: {
                            five: Infinity,
                        },
                    },
                },
            ],
            throws: undefined,
        },
        {
            description: 'should not match with invalid nested properties',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: {
                        nested: {
                            five: 4,
                        },
                    },
                },
                {
                    a: 99,
                    b: Infinity,
                    c: {
                        nested: {
                            five: Infinity,
                            six: 7,
                        },
                    },
                },
            ],
            throws: 'test object does not have key "six" from expected shape.',
        },
    ]);
});

describe('ObjectWithAtLeastSingleEntryArrays', () => {
    it('should require all arrays to have at least one entry', () => {
        const randomThing = {
            what: 5,
            nested: {
                subArray: [] as string[],
            },
            topArray: [] as number[],
        };

        const shouldAllowAssignment: ObjectWithAtLeastSingleEntryArrays<typeof randomThing> = {
            what: 5,
            nested: {
                subArray: ['yo'],
            },
            topArray: [5],
        };

        const invalidAssignment: ObjectWithAtLeastSingleEntryArrays<typeof randomThing> = {
            what: 5,
            nested: {
                // @ts-expect-error
                subArray: [],
            },
            // @ts-expect-error
            topArray: [],
        };
    });
});
