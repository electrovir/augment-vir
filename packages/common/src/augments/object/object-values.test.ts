import {assert} from '@augment-vir/assert';
import type {ValueAtRequiredKey} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {getObjectTypedValues} from './object-values.js';

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

describe('ValueAtRequiredKey', () => {
    it('requires an indexed key', () => {
        assert.tsType<ValueAtRequiredKey<Partial<Record<any, string>>, 'hi'>>().equals<string>();
    });
});

describe(getObjectTypedValues.name, () => {
    itCases(getObjectTypedValues, [
        {
            it: 'gets basic values',
            input: greekNames,
            expect: [
                greekNames[Planet.Mercury],
                greekNames[Planet.Venus],
                greekNames[Planet.Earth],
            ],
        },
        {
            it: 'does something with non-objects',
            input: 'hello there',
            expect: [
                'h',
                'e',
                'l',
                'l',
                'o',
                ' ',
                't',
                'h',
                'e',
                'r',
                'e',
            ],
        },
    ]);

    it('handles optional properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string>>;

        assert.tsType(getObjectTypedValues(exampleObject)).equals<string[]>();

        const example2 = {} as Partial<{
            [x in string]: RegExp;
        }>;

        assert.tsType(getObjectTypedValues(example2)).equals<RegExp[]>();
    });

    it('handles nullable properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string | undefined>>;

        assert.tsType(getObjectTypedValues(exampleObject)).equals<(string | undefined)[]>();
    });
});
