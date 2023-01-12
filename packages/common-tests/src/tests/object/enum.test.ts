import {expect} from 'chai';
import {describe, it} from 'mocha';
import {
    filterToEnumValues,
    getEnumTypedKeys,
    getEnumTypedValues,
    isEnumValue,
} from '../../../../common/src';

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
