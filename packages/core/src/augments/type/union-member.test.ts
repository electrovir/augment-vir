import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type UnionMember} from './union-member.js';

describe('UnionMember', () => {
    it('returns the only member of a single-member union', () => {
        assert.tsType<UnionMember<'a'>>().equals<'a'>();
        assert.tsType<UnionMember<number>>().equals<number>();
    });

    it('returns exactly one member of a multi-member union', () => {
        assert.tsType<UnionMember<'a' | 'b' | 'c'>>().matches<'a' | 'b' | 'c'>();
        assert.tsType<UnionMember<'a' | 'b'>>().notEquals<'a' | 'b'>();
    });

    it('is never for never', () => {
        assert.tsType<UnionMember<never>>().equals<never>();
    });

    it('does not collapse boolean into a single branch', () => {
        assert.tsType<UnionMember<boolean>>().matches<boolean>();
    });
});
