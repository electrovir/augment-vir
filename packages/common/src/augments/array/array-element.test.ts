import {describe, it} from '@augment-vir/test';
import {assert} from 'run-time-assertions';
import {ArrayElement, MaybeArray, MaybeReadonlyArray} from './array-element.js';

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
    });
});

describe('MaybeReadonlyArray', () => {
    it('can be either an entry or an array', () => {
        const test1: MaybeReadonlyArray<string> = 'hi';
        const test2: MaybeReadonlyArray<string> = ['hi'];
    });
});
