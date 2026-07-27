import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type ExcludeExactly} from './exclude-exactly.js';

describe('ExcludeExactly', () => {
    it('removes an exact union member', () => {
        assert.tsType<ExcludeExactly<'a' | 'b' | 'c', 'b'>>().equals<'a' | 'c'>();
    });

    it('removes multiple members when given a union to delete', () => {
        assert.tsType<ExcludeExactly<'a' | 'b' | 'c', 'a' | 'c'>>().equals<'b'>();
    });

    it('leaves the union unchanged when nothing matches exactly', () => {
        assert.tsType<ExcludeExactly<'a' | 'b', 'c'>>().equals<'a' | 'b'>();
    });

    it('only removes exact matches, unlike the built-in Exclude', () => {
        /** The built-in `Exclude` drops `'a'` here because `'a'` is assignable to `string`. */
        assert.tsType<Exclude<'a' | string[], string>>().equals<string[]>();
        assert.tsType<ExcludeExactly<'a' | string[], string>>().equals<'a' | string[]>();
    });

    it('removes a widened member only when it matches exactly', () => {
        assert.tsType<ExcludeExactly<string | number, string>>().equals<number>();
    });

    it('handles any and never on either side', () => {
        assert.tsType<ExcludeExactly<any, any>>().equals<never>();
        assert.tsType<ExcludeExactly<any, string>>().equals<any>();
        assert.tsType<ExcludeExactly<never, never>>().equals<never>();
        assert.tsType<ExcludeExactly<never, string>>().equals<never>();
        assert.tsType<ExcludeExactly<'a' | 'b', never>>().equals<'a' | 'b'>();
        assert.tsType<ExcludeExactly<'a' | 'b', any>>().equals<'a' | 'b'>();
    });
});
