import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {ArrayElement, MaybeArray, MaybeReadonlyArray} from './array-element.js';

describe('ArrayElement', ({it}) => {
    it('extracts array elements', () => {
        assertTypeOf<ArrayElement<string[]>>().toEqualTypeOf<string>();
    });
    it('works on tuples', () => {
        assertTypeOf<ArrayElement<[string]>>().toEqualTypeOf<string>();
    });
    it('works on union elements', () => {
        assertTypeOf<ArrayElement<(string | number)[]>>().toEqualTypeOf<string | number>();
    });
    it('works on readonly arrays', () => {
        assertTypeOf<ArrayElement<ReadonlyArray<string>>>().toEqualTypeOf<string>();
    });
});

describe('MaybeArray', ({it}) => {
    it('can be either an entry or an array', () => {
        const test1: MaybeArray<string> = 'hi';
        const test2: MaybeArray<string> = ['hi'];
    });
});

describe('MaybeReadonlyArray', ({it}) => {
    it('can be either an entry or an array', () => {
        const test1: MaybeReadonlyArray<string> = 'hi';
        const test2: MaybeReadonlyArray<string> = ['hi'];
    });
});
