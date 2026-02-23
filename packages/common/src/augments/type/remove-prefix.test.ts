import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type RemovePrefix} from './remove-prefix.js';

describe('RemovePrefix', () => {
    it('removes a simple prefix', () => {
        assert.tsType<RemovePrefix<'vira-red', 'vira-'>>().equals<'red'>();
    });

    it('removes a multi-segment prefix', () => {
        assert
            .tsType<RemovePrefix<'vira-red-foreground-body', 'vira-red-'>>()
            .equals<'foreground-body'>();
    });

    it('returns never when the prefix does not match', () => {
        assert.tsType<RemovePrefix<'no-match', 'prefix-'>>().equals<never>();
    });

    it('returns never for an empty string with a non-empty prefix', () => {
        assert.tsType<RemovePrefix<'', 'vira-'>>().equals<never>();
    });

    it('removes the prefix from a union of strings', () => {
        assert
            .tsType<
                RemovePrefix<'vira-red-foreground-body' | 'vira-red-foreground-header', 'vira-red-'>
            >()
            .equals<'foreground-body' | 'foreground-header'>();
    });

    it('filters out non-matching members of a union', () => {
        assert
            .tsType<RemovePrefix<'vira-red-foreground' | 'other-key', 'vira-red-'>>()
            .equals<'foreground'>();
    });

    it('distributes over a union prefix', () => {
        assert
            .tsType<RemovePrefix<'vira-red-foreground', 'vira-' | 'vira-red-'>>()
            .equals<'red-foreground' | 'foreground'>();
    });

    it('removes a deeply nested prefix matching real usage', () => {
        assert
            .tsType<
                RemovePrefix<'vira-red-foreground-body' | 'vira-red-on-self-header', 'vira-red-'>
            >()
            .equals<'foreground-body' | 'on-self-header'>();
    });
});
