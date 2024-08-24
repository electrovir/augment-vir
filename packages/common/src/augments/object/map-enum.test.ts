import {assert} from '@augment-vir/assert';
import {getObjectTypedKeys, type MaybePromise, type Values} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {mapEnumToObject} from './map-enum.js';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(mapEnumToObject.name, () => {
    it('maps an enum', () => {
        const output = mapEnumToObject(Planet, () => 5);
        assert.tsType(output).equals<Record<Planet, number>>();

        getObjectTypedKeys(output).forEach((key) => {
            assert.isIn(key, Planet);
        });
        Object.values(output).forEach((value) => {
            assert.strictEquals(value, 5);
        });
    });

    it('types a promise', async () => {
        const output = mapEnumToObject(Planet, () => Promise.resolve(5));
        assert.tsType(output).equals<Promise<Record<Values<typeof Planet>, number>>>();
        assert.instanceOf(output, Promise);

        assert.deepEquals(await output, {
            earth: 5,
            mercury: 5,
            venus: 5,
        });
    });

    it('types a maybe promise', async () => {
        const output = mapEnumToObject(Planet, (): MaybePromise<number> => Promise.resolve(5));
        assert.tsType(output).equals<MaybePromise<Record<Values<typeof Planet>, number>>>();
        assert.instanceOf(output, Promise);

        assert.deepEquals(await output, {
            earth: 5,
            mercury: 5,
            venus: 5,
        });
    });
});
