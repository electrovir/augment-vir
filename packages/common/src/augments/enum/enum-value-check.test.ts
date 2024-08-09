import {assert, describe, it} from '@augment-vir/test';
import {assertThrows} from 'run-time-assertions';
import {
    assertEnumValue,
    ensureEnumValue,
    filterToEnumValues,
    isEnumValue,
} from './enum-value-check.js';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

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
        assert.deepStrictEqual(
            testEnumValues.filter((testValue) => isEnumValue(testValue, Planet)),
            [
                Planet.Mercury,
                Planet.Venus,
                Planet.Earth,
            ],
        );
    });
});

describe(assertEnumValue.name, () => {
    it('matches all correct enum values', () => {
        assertThrows(() => assertEnumValue('test value', Planet));
    });
});

describe(ensureEnumValue.name, () => {
    it('has proper types', () => {
        ensureEnumValue(Planet.Mercury, Planet);
        ensureEnumValue('mercury', Planet);
        ensureEnumValue('earth', Planet);
        assertThrows(() => ensureEnumValue('not a planet', Planet));
        assertThrows(() => ensureEnumValue(2, Planet));
        const testPlanet: Planet = ensureEnumValue('mercury', Planet);

        assertThrows(() => {
            const testPlanet2: Planet = ensureEnumValue(2, Planet);
        });
    });
});

describe(filterToEnumValues.name, () => {
    enum TestEnum {
        A = 'a',
        B = 'b',
        C = 'c',
    }

    it('empty input results in empty output', () => {
        assert.deepStrictEqual(filterToEnumValues([], TestEnum), []);
    });

    it('excludes invalid enum values', () => {
        assert.deepStrictEqual(
            filterToEnumValues(
                [
                    'derby',
                    'who',
                    'done',
                    'it',
                ],
                TestEnum,
            ),
            [],
        );
    });

    const validValuesTest = [
        TestEnum.A,
        TestEnum.B,
        TestEnum.C,
    ];

    it('includes valid enum values', () => {
        assert.deepStrictEqual(filterToEnumValues(validValuesTest, TestEnum), validValuesTest);
    });

    it('filters out non-enum values', () => {
        assert.deepStrictEqual(
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
            [Planet.Venus],
        );
    });

    it('output order matches input order', () => {
        assert.deepStrictEqual(
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
            [
                TestEnum.C,
                TestEnum.B,
                TestEnum.A,
            ],
        );
    });
});
