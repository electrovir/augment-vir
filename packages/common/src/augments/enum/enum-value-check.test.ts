import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {filterToEnumValues} from './enum-value-check.js';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(filterToEnumValues.name, () => {
    enum TestEnum {
        A = 'a',
        B = 'b',
        C = 'c',
    }

    it('empty input results in empty output', () => {
        assert.deepEquals(filterToEnumValues([], TestEnum), []);
    });

    it('excludes invalid enum values', () => {
        assert.deepEquals(
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
        assert.deepEquals(filterToEnumValues(validValuesTest, TestEnum), validValuesTest);
    });

    it('filters out non-enum values', () => {
        assert.deepEquals(
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
        assert.deepEquals(
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
