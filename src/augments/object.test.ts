import {
    areJsonEqual,
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
    typedHasOwnProperties,
    typedHasOwnProperty,
} from './object';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(getEnumTypedKeys.name, () => {
    it('gets basic enum keys properly', () => {
        expect(getEnumTypedKeys(Planet)).toEqual([
            'Mercury',
            'Venus',
            'Earth',
        ]);
    });

    it('enum keys can be used to access the enum', () => {
        const keys = getEnumTypedKeys(Planet);
        expect(keys.map((key) => Planet[key])).toEqual([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });
});

describe(getEnumTypedValues.name, () => {
    it('gets basic enum values properly', () => {
        expect(getEnumTypedValues(Planet)).toEqual([
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
        expect(testEnumValues.filter((testValue) => isEnumValue(testValue, Planet))).toEqual([
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
        expect(getObjectTypedKeys(greekNames)).toEqual([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });

    it('includes symbols', () => {
        const mySymbol = Symbol('derp');

        expect(getObjectTypedKeys({[mySymbol]: 'nothing', ...greekNames})).toEqual([
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
            mySymbol,
        ]);
    });
});

describe(getObjectTypedValues.name, () => {
    it('gets basic object values', () => {
        expect(getObjectTypedValues(greekNames)).toEqual([
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
        expect(filterToEnumValues([], TestEnum)).toEqual([]);
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
        ).toEqual([]);
    });

    const validValuesTest = [
        TestEnum.A,
        TestEnum.B,
        TestEnum.C,
    ];

    it('includes valid enum values', () => {
        expect(filterToEnumValues(validValuesTest, TestEnum)).toEqual(validValuesTest);
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
        ).toEqual([
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
        ).toEqual([Planet.Venus]);
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
        ).toEqual([
            TestEnum.C,
            TestEnum.B,
            TestEnum.A,
        ]);
    });
});

describe(typedHasOwnProperty.name, () => {
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
                expect(typedHasOwnProperty(testCase.input, testCase.property)).toBe(
                    testCase.output,
                );
            } catch (error) {
                console.error(message);
                throw error;
            }
        });
    });

    it('should pass type tests', () => {
        const idkWhatThisIs: unknown = (() => {}) as unknown;
        if (typedHasOwnProperty(idkWhatThisIs, 'name')) {
            idkWhatThisIs.name;
        } else {
            // @ts-expect-error
            idkWhatThisIs.name;
        }
    });
});

describe(typedHasOwnProperties.name, () => {
    const testObject = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
    };

    it('should correctly test existing properties', () => {
        expect(
            typedHasOwnProperties(testObject, [
                'a',
                'b',
                'c',
                'd',
                'e',
            ]),
        ).toBe(true);
    });

    it('should correctly fail on nonexisting properties', () => {
        expect(
            typedHasOwnProperties(testObject, [
                'abba',
                'blah',
                'cookie',
                'derp',
                'ear',
            ]),
        ).toBe(false);
    });
});

describe(isObject.name, () => {
    it('should pass on empty object', () => {
        expect(isObject({})).toBe(true);
    });

    it('should pass on filled in object', () => {
        expect(isObject({a: '4', b: '5'})).toBe(true);
    });

    it('should fail on null', () => {
        expect(isObject(null)).toBe(false);
    });

    it('should fail on function', () => {
        expect(isObject(() => {})).toBe(false);
    });

    it('should fail on other non-objects', () => {
        const testingItems = [
            5,
            '5',
        ];

        expect(testingItems.some(isObject)).toBe(false);
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

        expect(getEntriesSortedByKey(testObjectA)).toEqual([
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

        expect(getEntriesSortedByKey(testObjectA)).toEqual([
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

        expect(areJsonEqual(objectA, objectB)).toBe(true);
    });

    it('should pass for same object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };

        expect(areJsonEqual(objectA, objectA)).toBe(true);
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

        expect(areJsonEqual(objectA, objectB)).toBe(false);
        expect(areJsonEqual({...objectA, b: 2}, objectB)).toBe(true);
    });
});

describe(copyThroughJson.name, () => {
    it('should create an identical copy', () => {
        const testObjectA = {a: 5, b: 'five', c: {d: 5}, e: [6]};

        expect(copyThroughJson(testObjectA)).toEqual(testObjectA);
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

        expect(testAssign).toBe(testObjectA.a);
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

        expect(getObjectTypedKeys(originalObject)).toEqual(getObjectTypedKeys(mappedObject));

        getObjectTypedKeys(originalObject).forEach((key) => {
            expect(originalObject.hasOwnProperty(key)).toBe(true);
            expect(mappedObject.hasOwnProperty(key)).toBe(true);

            expect(Number(mappedObject[key])).toBe(originalObject[key]);
            expect(String(originalObject[key])).toBe(mappedObject[key]);
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

        expect(getObjectTypedKeys(originalObject)).toEqual(getObjectTypedKeys(awaitedMappedObject));

        getObjectTypedKeys(originalObject).forEach((key) => {
            expect(originalObject.hasOwnProperty(key)).toBe(true);
            expect(awaitedMappedObject.hasOwnProperty(key)).toBe(true);

            expect(Number(awaitedMappedObject[key])).toBe(originalObject[key]);
            expect(String(originalObject[key])).toBe(awaitedMappedObject[key]);
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
