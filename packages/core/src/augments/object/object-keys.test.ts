import {assert} from '@augment-vir/assert';
import {getObjectTypedKeys} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {ExtractKeysWithMatchingValues} from './object-keys.js';

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

describe(getObjectTypedKeys.name, () => {
    it('gets basic object keys', () => {
        assert.deepEquals(getObjectTypedKeys(greekNames), [
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

        assert.deepEquals(getObjectTypedKeys({[mySymbol]: 'nothing', ...greekNames}), [
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
            mySymbol,
        ]);
    });
});

describe('ExtractKeysWithMatchingValues', () => {
    it('extracts keys', () => {
        assert
            .tsType<ExtractKeysWithMatchingValues<{a: RegExp; b: string}, string>>()
            .equals<'b'>();
    });
});
