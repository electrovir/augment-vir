import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type NonEmptyString} from './non-empty-string.js';

describe('NonEmptyString', () => {
    it('collapses the empty string to never', () => {
        assert.tsType<NonEmptyString<''>>().equals<never>();
        assert.tsType<NonEmptyString<never>>().equals<never>();
    });

    it('passes through non-empty-string types', () => {
        assert.tsType<NonEmptyString<'something'>>().equals<'something'>();
        assert.tsType<NonEmptyString<string>>().equals<string>();
        assert.tsType<NonEmptyString<number>>().equals<number>();
    });

    it('distributes over a union, dropping only the empty string', () => {
        assert.tsType<NonEmptyString<'' | 'a'>>().equals<'a'>();
    });

    it('rejects an empty string assignment', () => {
        const emptyString = '';
        // @ts-expect-error: blocks an empty string
        const blocked: NonEmptyString<'something'> = emptyString;

        assert.tsType(blocked).equals<'something'>();
    });

    it('rejects a mismatched string literal', () => {
        // @ts-expect-error: blocks a string mismatch
        const mismatched: NonEmptyString<'something'> = 'derp';

        assert.tsType(mismatched).equals<'something'>();
    });

    it('accepts a matching string literal', () => {
        const matching: NonEmptyString<'something'> = 'something';

        assert.strictEquals(matching, 'something');
    });
});
