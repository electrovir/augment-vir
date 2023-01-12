import {assertTypeOf, itCases} from '@augment-vir/chai';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {
    getEntriesSortedByKey,
    getEnumTypedValues,
    getObjectTypedKeys,
    getObjectTypedValues,
    typedObjectFromEntries,
} from '../../../../common/src';
import {isKeyof} from '../../../../common/src/augments/object/object-entries';

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
    it('gets basic object values', () => {
        expect(getObjectTypedValues(greekNames)).to.deep.equal([
            greekNames[Planet.Mercury],
            greekNames[Planet.Venus],
            greekNames[Planet.Earth],
        ]);
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
