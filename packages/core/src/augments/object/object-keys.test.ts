import {assert} from '@augment-vir/assert';
import {getObjectTypedKeys} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {
    type ExcludeKeysWithMatchingValues,
    type ExtractKeysWithMatchingValues,
} from './object-keys.js';

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
        assert.isEmpty(getObjectTypedKeys(''));
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

describe('ExcludeKeysWithMatchingValues', () => {
    it('works on a simple exclusion', () => {
        assert
            .tsType<
                ExcludeKeysWithMatchingValues<
                    {
                        a: string;
                        b: string | undefined;
                        c: number;
                    },
                    string
                >
            >()
            .equals<'c'>();
    });
    it('works with a union exclusion', () => {
        assert
            .tsType<
                ExcludeKeysWithMatchingValues<
                    {
                        a: string;
                        b: string | undefined;
                        c: number;
                        d: boolean;
                    },
                    string | number
                >
            >()
            .equals<'d'>();
    });
});
