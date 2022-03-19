import {testGroup} from 'test-vir';
import {
    filterToEnumValues,
    getEnumTypedKeys,
    getEnumTypedValues,
    getObjectTypedKeys,
    getObjectTypedValues,
    isEnumValue,
    isObject,
    typedHasOwnProperties,
    typedHasOwnProperty,
} from './object';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

testGroup({
    description: getEnumTypedKeys.name,
    tests: (runTest) => {
        runTest({
            description: 'gets basic enum keys properly',
            expect: [
                'Mercury',
                'Venus',
                'Earth',
            ],
            test: () => {
                return getEnumTypedKeys(Planet);
            },
        });

        runTest({
            description: 'enum keys can be used to access the enum',
            expect: [
                Planet.Mercury,
                Planet.Venus,
                Planet.Earth,
            ],
            test: () => {
                const keys = getEnumTypedKeys(Planet);
                return keys.map((key) => Planet[key]);
            },
        });
    },
});

testGroup({
    description: getEnumTypedValues.name,
    tests: (runTest) => {
        runTest({
            description: 'gets basic enum values properly',
            expect: [
                Planet.Mercury,
                Planet.Venus,
                Planet.Earth,
            ],
            test: () => {
                return getEnumTypedValues(Planet);
            },
        });
    },
});

testGroup({
    description: isEnumValue.name,
    tests: (runTest) => {
        const testEnumValues = [
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
            'moon',
            'luna',
            'not a planet',
        ];

        runTest({
            description: 'matches all correct enum values',
            expect: [
                Planet.Mercury,
                Planet.Venus,
                Planet.Earth,
            ],
            test: () => {
                return testEnumValues.filter((testValue) => isEnumValue(testValue, Planet));
            },
        });
    },
});

const greekNames: Record<Planet, string> = {
    [Planet.Mercury]: 'Hermes',
    [Planet.Venus]: 'Aphrodite',
    [Planet.Earth]: 'Earth',
};

testGroup({
    description: getObjectTypedKeys.name,
    tests: (runTest) => {
        runTest({
            description: 'gets basic object keys',
            expect: [
                Planet.Mercury,
                Planet.Venus,
                Planet.Earth,
            ],
            test: () => {
                return getObjectTypedKeys(greekNames);
            },
        });
    },
});

testGroup({
    description: getObjectTypedValues.name,
    tests: (runTest) => {
        runTest({
            description: 'gets basic object values',
            expect: [
                greekNames[Planet.Mercury],
                greekNames[Planet.Venus],
                greekNames[Planet.Earth],
            ],
            test: () => {
                return getObjectTypedValues(greekNames);
            },
        });
    },
});

testGroup({
    description: filterToEnumValues.name,
    tests: (runTest) => {
        enum TestEnum {
            A = 'a',
            B = 'b',
            C = 'c',
        }

        runTest({
            description: 'empty input results in empty output',
            expect: [],
            test: () => {
                return filterToEnumValues([], TestEnum);
            },
        });

        runTest({
            description: 'excludes invalid enum values',
            expect: [],
            test: () => {
                return filterToEnumValues(
                    [
                        'derby',
                        'who',
                        'done',
                        'it',
                    ],
                    TestEnum,
                );
            },
        });

        const validValuesTest = [
            TestEnum.A,
            TestEnum.B,
            TestEnum.C,
        ];
        runTest({
            description: 'includes valid enum values',
            expect: validValuesTest,
            test: () => {
                return filterToEnumValues(validValuesTest, TestEnum);
            },
        });

        runTest({
            description: 'works with case insensitivity',
            expect: [
                Planet.Mercury,
                Planet.Venus,
                Planet.Earth,
            ],
            test: () => {
                return filterToEnumValues(
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
                );
            },
        });

        runTest({
            description: "does not do case insensitivity when it's not explicitly turned on",
            expect: [Planet.Venus],
            test: () => {
                return filterToEnumValues(
                    [
                        'MeRcUrY',
                        Planet.Venus,
                        'EARth',
                        'MOON',
                        'luNA',
                        'not A planET',
                    ],
                    Planet,
                );
            },
        });

        runTest({
            description: 'output order matches input order',
            expect: [
                TestEnum.C,
                TestEnum.B,
                TestEnum.A,
            ],
            test: () => {
                return filterToEnumValues(
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
                );
            },
        });
    },
});

testGroup({
    description: typedHasOwnProperty.name,
    tests: (runTest) => {
        const testObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        runTest({
            description: 'should correctly test existing property name',
            expect: true,
            test: () => {
                return typedHasOwnProperty('a', testObject);
            },
        });

        runTest({
            description: 'should correctly test another existing property name',
            expect: true,
            test: () => {
                return typedHasOwnProperty('b', testObject);
            },
        });

        runTest({
            description: 'should fail on non-existing property names',
            expect: false,
            test: () => {
                return typedHasOwnProperty('blah', testObject);
            },
        });
    },
});

testGroup({
    description: typedHasOwnProperties.name,
    tests: (runTest) => {
        const testObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        runTest({
            description: 'should correctly test existing properties',
            expect: true,
            test: () => {
                return typedHasOwnProperties(
                    [
                        'a',
                        'b',
                        'c',
                        'd',
                        'e',
                    ],
                    testObject,
                );
            },
        });

        runTest({
            description: 'should correctly fail on nonexisting properties',
            expect: false,
            test: () => {
                return typedHasOwnProperties(
                    [
                        'abba',
                        'blah',
                        'cookie',
                        'derp',
                        'ear',
                    ],
                    testObject,
                );
            },
        });
    },
});

testGroup({
    description: isObject.name,
    tests: (runTest) => {
        runTest({
            description: 'should pass on empty object',
            expect: true,
            test: () => {
                return isObject({});
            },
        });

        runTest({
            description: 'should pass on filled in object',
            expect: true,
            test: () => {
                return isObject({a: '4', b: '5'});
            },
        });

        runTest({
            description: 'should fail on null',
            expect: false,
            test: () => {
                return isObject(null);
            },
        });

        runTest({
            description: 'should fail on other non-objects',
            expect: false,
            test: () => {
                const testingItems = [
                    5,
                    '5',
                ];

                return testingItems.some(isObject);
            },
        });
    },
});
