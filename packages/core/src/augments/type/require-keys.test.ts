/* eslint-disable @typescript-eslint/no-empty-object-type -- these type tests intentionally use the `{}` identity type, matching type-fest. */
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    type HasRequiredKeys,
    type RequireAtLeastOne,
    type RequireExactlyOne,
} from './require-keys.js';

type ExactlyOneMessages = {
    default: string;
    macos: string;
    linux: string;
    optional?: string;
};

type AtLeastOneMessages = {
    default: string;
    macos?: string;
    linux?: string;
    windows?: string;
    optional?: string;
};

describe('HasRequiredKeys', () => {
    it('is true when at least one key is required', () => {
        assert.tsType<HasRequiredKeys<{a: string; b?: boolean}>>().equals<true>();
        assert.tsType<HasRequiredKeys<{a: string; b: boolean}>>().equals<true>();
    });

    it('is false when every key is optional', () => {
        assert.tsType<HasRequiredKeys<{a?: string; b?: boolean}>>().equals<false>();
    });
});

describe('RequireExactlyOne', () => {
    it('requires exactly one of the listed keys', () => {
        assert
            .tsType<{macos: string; default: string}>()
            .matches<RequireExactlyOne<ExactlyOneMessages, 'macos' | 'linux'>>();
        assert
            .tsType<{linux: string; optional: string; default: string}>()
            .matches<RequireExactlyOne<ExactlyOneMessages, 'macos' | 'linux'>>();
    });

    it('rejects none or more than one of the listed keys', () => {
        assert.tsType<{}>().notMatches<RequireExactlyOne<ExactlyOneMessages, 'macos' | 'linux'>>();
        assert
            .tsType<{macos: string; linux: string; default: string}>()
            .notMatches<RequireExactlyOne<ExactlyOneMessages, 'macos' | 'linux'>>();
    });

    it('defaults to requiring exactly one of all keys', () => {
        assert.tsType<{a: number}>().matches<RequireExactlyOne<{a: number; b: number}>>();
        assert.tsType<{b: number}>().matches<RequireExactlyOne<{a: number; b: number}>>();
        assert.tsType<{}>().notMatches<RequireExactlyOne<{a: number; b: number}>>();
        assert
            .tsType<{a: number; b: number}>()
            .notMatches<RequireExactlyOne<{a: number; b: number}>>();
    });

    it('produces the expected discriminated union', () => {
        type Actual = RequireExactlyOne<{a: number; b: string}>;
        type Expected = {a: number; b?: never} | {a?: never; b: string};
        assert.tsType<Actual>().matches<Expected>();
        assert.tsType<Expected>().matches<Actual>();
    });

    it('produces the expected discriminated union for three keys', () => {
        type Actual = RequireExactlyOne<{a: number; b: string; c: boolean}>;
        type Expected =
            | {a: number; b?: never; c?: never}
            | {a?: never; b: string; c?: never}
            | {a?: never; b?: never; c: boolean};
        assert.tsType<Actual>().matches<Expected>();
        assert.tsType<Expected>().matches<Actual>();
    });

    it('is never for an empty object or an empty key set', () => {
        assert.tsType<RequireExactlyOne<{}>>().equals<never>();
        assert.tsType<RequireExactlyOne<{a: string; b: number}, never>>().equals<never>();
    });
});

describe('RequireAtLeastOne', () => {
    it('requires at least one of the listed keys', () => {
        assert
            .tsType<{macos: string; default: string}>()
            .matches<RequireAtLeastOne<AtLeastOneMessages, 'macos' | 'linux' | 'windows'>>();
        assert
            .tsType<{linux: string; default: string; optional: string}>()
            .matches<RequireAtLeastOne<AtLeastOneMessages, 'macos' | 'linux' | 'windows'>>();
        assert
            .tsType<{macos: string; linux: string; windows: string; default: string}>()
            .matches<RequireAtLeastOne<AtLeastOneMessages, 'macos' | 'linux' | 'windows'>>();
    });

    it('rejects providing none of the listed keys or missing required keys', () => {
        assert
            .tsType<{}>()
            .notMatches<RequireAtLeastOne<AtLeastOneMessages, 'macos' | 'linux' | 'windows'>>();
        assert
            .tsType<{macos: string}>()
            .notMatches<RequireAtLeastOne<AtLeastOneMessages, 'macos' | 'linux' | 'windows'>>();
        assert
            .tsType<{default: string}>()
            .notMatches<RequireAtLeastOne<AtLeastOneMessages, 'macos' | 'linux' | 'windows'>>();
    });

    it('defaults to requiring at least one of all keys', () => {
        assert.tsType<{a: number}>().matches<RequireAtLeastOne<{a: number; b: number}>>();
        assert.tsType<{b: number}>().matches<RequireAtLeastOne<{a: number; b: number}>>();
        assert
            .tsType<{a: number; b: number}>()
            .matches<RequireAtLeastOne<{a: number; b: number}>>();
        assert.tsType<{}>().notMatches<RequireAtLeastOne<{a: number; b: number}>>();
    });

    it('produces the expected union', () => {
        type Actual = RequireAtLeastOne<{a: number; b: string}>;
        type Expected = {a: number; b?: string} | {a?: number; b: string};
        assert.tsType<Actual>().matches<Expected>();
        assert.tsType<Expected>().matches<Actual>();
    });

    it('is never for an empty object or an empty key set', () => {
        assert.tsType<RequireAtLeastOne<{}>>().equals<never>();
        assert.tsType<RequireAtLeastOne<{a: string; b: number}, never>>().equals<never>();
    });
});
