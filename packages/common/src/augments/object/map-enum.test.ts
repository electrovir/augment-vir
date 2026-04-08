import {assert} from '@augment-vir/assert';
import {
    type EnumBaseType,
    getObjectTypedKeys,
    type MaybePromise,
    type Values,
    wait,
} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {mapEnumToObject} from './map-enum.js';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(mapEnumToObject.name, () => {
    it('maps an enum', () => {
        const output = mapEnumToObject(Planet, (enumValue) => {
            assert.isEnumValue(enumValue, Planet);
            assert.tsType(enumValue).equals<Planet>();
            return 5;
        });
        assert.tsType(output).equals<Record<Planet, number>>();
        assert.tsType(output).notEquals<Promise<Record<Planet, number>>>();
        assert.isNotPromise(output);

        getObjectTypedKeys(output).forEach((key) => {
            assert.isIn(key, Planet);
        });
        Object.values(output).forEach((value) => {
            assert.strictEquals(value, 5);
        });
    });

    it('types a promise', async () => {
        const output = mapEnumToObject(Planet, (enumValue) => {
            assert.isEnumValue(enumValue, Planet);
            assert.tsType(enumValue).equals<Planet>();
            return Promise.resolve(5);
        });
        assert.tsType(output).equals<Promise<Record<Values<typeof Planet>, number>>>();
        assert.isPromise(output);

        assert.deepEquals(await output, {
            earth: 5,
            mercury: 5,
            venus: 5,
        });
    });

    it('types a maybe promise', async () => {
        const output = mapEnumToObject(Planet, (enumValue): MaybePromise<number> => {
            assert.isEnumValue(enumValue, Planet);
            assert.tsType(enumValue).equals<Planet>();
            return Promise.resolve(5);
        });
        assert.tsType(output).equals<MaybePromise<Record<Values<typeof Planet>, number>>>();
        assert.isPromise(output);

        assert.deepEquals(await output, {
            earth: 5,
            mercury: 5,
            venus: 5,
        });
    });

    it('handles a sync error', () => {
        assert.throws(
            () => {
                mapEnumToObject(Planet, () => {
                    throw new Error('fake error');
                    return 'hi';
                });
            },
            {
                matchMessage: 'fake error',
            },
        );
    });

    it('handles an async error', async () => {
        const output = mapEnumToObject(Planet, async () => {
            await wait({
                milliseconds: 0,
            });
            throw new Error('fake error');
        });

        await assert.throws(output, {
            matchMessage: 'fake error',
        });
    });

    it('handles a callback that is sometimes async', async () => {
        const output = mapEnumToObject(Planet, (enumValue) => {
            if (enumValue === Planet.Mercury) {
                return 5;
            } else {
                return Promise.resolve(5);
            }
        });
        assert.isPromise(output);

        assert.deepEquals(await output, {
            mercury: 5,
            venus: 5,
            earth: 5,
        });
    });

    it('resolves value type through generic EnumBaseType constraint', () => {
        function genericCaller<const Enum extends EnumBaseType>(enumInput: Enum) {
            return mapEnumToObject(enumInput, (enumValue) => {
                /** Verify that the enum value type is accessible as a PropertyKey. */
                const key: PropertyKey = enumValue;

                return String(key);
            });
        }

        const result = genericCaller(Planet);

        assert.deepEquals(result, {
            mercury: 'mercury',
            venus: 'venus',
            earth: 'earth',
        });
    });
});
