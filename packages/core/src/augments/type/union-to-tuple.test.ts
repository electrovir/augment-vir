import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type UnionToTuple} from './union-to-tuple.js';

describe('UnionToTuple', () => {
    it('converts an empty union into an empty tuple', () => {
        assert.tsType<UnionToTuple<never>>().equals<[]>();
    });

    it('wraps a single member into a one-element tuple', () => {
        assert.tsType<UnionToTuple<'a'>>().equals<['a']>();
    });

    it('produces a tuple with one element per union member', () => {
        assert.tsType<UnionToTuple<'a' | 'b' | 'c'>['length']>().equals<3>();
    });

    it('preserves every union member as an element', () => {
        assert.tsType<UnionToTuple<'a' | 'b' | 'c'>[number]>().equals<'a' | 'b' | 'c'>();
    });

    it('works with mixed literal types', () => {
        assert.tsType<UnionToTuple<1 | 'b' | true>['length']>().equals<3>();
        assert.tsType<UnionToTuple<1 | 'b' | true>[number]>().equals<1 | 'b' | true>();
    });
});
