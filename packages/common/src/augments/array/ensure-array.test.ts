import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {ensureArray} from './ensure-array.js';

describe(ensureArray.name, () => {
    itCases(ensureArray, [
        {
            it: 'leaves an array',
            input: ['a'],
            expect: ['a'],
        },
        {
            it: 'creates an array',
            input: 'a',
            expect: ['a'],
        },
    ]);

    it('returns the exact array', () => {
        const originalArray = ['a'];
        assert.strictEquals(originalArray, ensureArray(originalArray));
    });

    it('has proper types', () => {
        assert.tsType(ensureArray(['a'])).equals<string[]>();
        assert.tsType(ensureArray('a')).equals<string[]>();

        const originalArray: ReadonlyArray<string> = ['a'];

        assert.tsType(ensureArray(originalArray)).equals<ReadonlyArray<string>>();
        assert
            .tsType(ensureArray(originalArray as typeof originalArray | string))
            .equals<ReadonlyArray<string>>();
    });
});
