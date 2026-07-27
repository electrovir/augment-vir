/* eslint-disable @typescript-eslint/no-empty-object-type -- these type tests intentionally use the `{}` identity type, matching type-fest. */
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type RequireOneOrNone} from './require-one-or-none.js';

type OneAtMost = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>>;
type OneOrTwo = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>, 'bar' | 'baz'>;

describe('RequireOneOrNone', () => {
    it('allows none or exactly one of all keys', () => {
        assert.tsType<{}>().matches<OneAtMost>();
        assert.tsType<{foo: true}>().matches<OneAtMost>();
        assert.tsType<{bar: true}>().matches<OneAtMost>();
        assert.tsType<{baz: true}>().matches<OneAtMost>();
    });

    it('rejects more than one of all keys', () => {
        assert.tsType<{foo: true; bar: true}>().notMatches<OneAtMost>();
        assert.tsType<{foo: true; baz: true}>().notMatches<OneAtMost>();
        assert.tsType<{bar: true; baz: true}>().notMatches<OneAtMost>();
        assert.tsType<{foo: true; bar: true; baz: true}>().notMatches<OneAtMost>();
    });

    it('keeps non-listed keys required', () => {
        assert.tsType<{foo: true}>().matches<OneOrTwo>();
        assert.tsType<{foo: true; bar: true}>().matches<OneOrTwo>();
        assert.tsType<{foo: true; baz: true}>().matches<OneOrTwo>();
    });

    it('rejects missing required keys or more than one listed key', () => {
        assert.tsType<{}>().notMatches<OneOrTwo>();
        assert.tsType<{bar: true}>().notMatches<OneOrTwo>();
        assert.tsType<{baz: true}>().notMatches<OneOrTwo>();
        assert.tsType<{foo: true; bar: true; baz: true}>().notMatches<OneOrTwo>();
    });

    it('produces the expected union', () => {
        type Actual = RequireOneOrNone<{a: number; b: string}>;
        type Expected = {a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never};
        assert.tsType<Actual>().matches<Expected>();
        assert.tsType<Expected>().matches<Actual>();
    });

    it('leaves the object unchanged when the key set is empty', () => {
        assert
            .tsType<RequireOneOrNone<{a: string; b: number}, never>>()
            .matches<{a: string; b: number}>();
        assert
            .tsType<{a: string; b: number}>()
            .matches<RequireOneOrNone<{a: string; b: number}, never>>();
    });
});
