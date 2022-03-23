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

    it('should correctly test existing property name', () => {
        expect(typedHasOwnProperty('a', testObject)).toBe(true);
    });

    it('should correctly test another existing property name', () => {
        expect(typedHasOwnProperty('b', testObject)).toBe(true);
    });

    it('should fail on non-existing property names', () => {
        expect(typedHasOwnProperty('blah', testObject)).toBe(false);
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
            typedHasOwnProperties(
                [
                    'a',
                    'b',
                    'c',
                    'd',
                    'e',
                ],
                testObject,
            ),
        ).toBe(true);
    });

    it('should correctly fail on nonexisting properties', () => {
        expect(
            typedHasOwnProperties(
                [
                    'abba',
                    'blah',
                    'cookie',
                    'derp',
                    'ear',
                ],
                testObject,
            ),
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

    it('should fail on other non-objects', () => {
        const testingItems = [
            5,
            '5',
        ];

        expect(testingItems.some(isObject)).toBe(false);
    });
});
