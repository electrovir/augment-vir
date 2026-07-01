import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type ArrayElement, type MaybeArray, type MaybeReadonlyArray} from './array.js';

describe('ArrayElement', () => {
    it('extracts array elements', () => {
        assert.tsType<ArrayElement<string[]>>().equals<string>();
    });
    it('works on tuples', () => {
        assert.tsType<ArrayElement<[string]>>().equals<string>();
    });
    it('works on union elements', () => {
        assert.tsType<ArrayElement<(string | number)[]>>().equals<string | number>();
    });
    it('works on readonly arrays', () => {
        assert.tsType<ArrayElement<ReadonlyArray<string>>>().equals<string>();
    });
});

describe('MaybeArray', () => {
    it('can be either an entry or an array', () => {
        const test1: MaybeArray<string> = 'hi';
        const test2: MaybeArray<string> = ['hi'];

        assert.tsType(test1).matches<MaybeArray<string>>();
        assert.tsType(test2).matches<MaybeArray<string>>();
        assert.tsType<MaybeArray<string>>().equals<string | string[]>();
    });
});

describe('MaybeReadonlyArray', () => {
    it('can be either an entry or an array', () => {
        const test1: MaybeReadonlyArray<string> = 'hi';
        const test2: MaybeReadonlyArray<string> = ['hi'];

        assert.tsType(test1).matches<MaybeReadonlyArray<string>>();
        assert.tsType(test2).matches<MaybeReadonlyArray<string>>();
        assert.tsType<MaybeReadonlyArray<string>>().equals<string | ReadonlyArray<string>>();
    });
});
