import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type IsOptionalKeyOf, type OptionalKeysOf} from './optional-keys-of.js';

type BaseObject = {
    a: string;
    b?: number;
    c: boolean;
};

declare const symbolKey: unique symbol;

type MixedMembers = {
    x?: string;
    y: number;
};

describe('OptionalKeysOf', () => {
    it('extracts optional keys', () => {
        assert.tsType<OptionalKeysOf<{a: string; b?: boolean}>>().equals<'b'>();
        assert.tsType<OptionalKeysOf<{a?: string; b?: boolean}>>().equals<'a' | 'b'>();
        assert.tsType<OptionalKeysOf<{a: string; b: boolean}>>().equals<never>();
    });

    it('handles readonly and mixed keys', () => {
        assert
            .tsType<
                OptionalKeysOf<{readonly a?: string; readonly b: number; c?: boolean; d: string}>
            >()
            .equals<'a' | 'c'>();
    });

    it('distributes over unions', () => {
        assert
            .tsType<
                OptionalKeysOf<{a: string; b?: number} | {readonly c?: string; readonly d: number}>
            >()
            .equals<'b' | 'c'>();
        assert
            .tsType<OptionalKeysOf<{a: string; b: number} | {a?: string; b?: number}>>()
            .equals<'a' | 'b'>();
    });

    it('handles arrays and tuples', () => {
        assert.tsType<OptionalKeysOf<[]>>().equals<never>();
        assert
            .tsType<
                OptionalKeysOf<
                    readonly [
                        string,
                        number,
                        boolean,
                    ]
                >
            >()
            .equals<never>();
        assert
            .tsType<
                OptionalKeysOf<
                    [
                        string,
                        number?,
                        boolean?,
                    ]
                >
            >()
            .equals<'1' | '2'>();
        assert
            .tsType<
                OptionalKeysOf<
                    | [string?]
                    | readonly [
                          string,
                          number?,
                      ]
                    | [
                          string,
                          number,
                          boolean?,
                      ]
                >
            >()
            .equals<'0' | '1' | '2'>();
    });

    it('is assignable to keyof but not vice versa', () => {
        assert
            .tsType<OptionalKeysOf<{a?: string; b: number}>>()
            .matches<keyof {a?: string; b: number}>();
        assert.tsType<OptionalKeysOf<{a?: string; b: number}>>().matches<PropertyKey>();
        assert
            .tsType<keyof {a?: string; b: number}>()
            .notMatches<OptionalKeysOf<{a?: string; b: number}>>();
    });
});

describe('IsOptionalKeyOf', () => {
    it('detects optional keys of a base object', () => {
        assert.tsType<IsOptionalKeyOf<BaseObject, 'a'>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<BaseObject, 'b'>>().equals<true>();
        assert.tsType<IsOptionalKeyOf<BaseObject, 'c'>>().equals<false>();
    });

    it('rejects keys not present in the object', () => {
        // @ts-expect-error: `d` is not a key of `BaseObject`.
        assert.tsType<IsOptionalKeyOf<BaseObject, 'd'>>().equals<false>();
    });

    it('handles index signatures', () => {
        assert.tsType<IsOptionalKeyOf<{[key: string]: string}, string>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<{[key: string]: string}, 'anything'>>().equals<true>();
    });

    it('handles readonly keys', () => {
        assert.tsType<IsOptionalKeyOf<{readonly a?: number; b: string}, 'a'>>().equals<true>();
        assert.tsType<IsOptionalKeyOf<{readonly a?: number; b: string}, 'b'>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<{readonly x: boolean; y?: string}, 'x'>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<{readonly x: boolean; y?: string}, 'y'>>().equals<true>();
    });

    it('resolves unions to a boolean and intersections precisely', () => {
        assert.tsType<IsOptionalKeyOf<{a?: number} | {a: number}, 'a'>>().equals<boolean>();
        assert.tsType<IsOptionalKeyOf<{a?: number} & {a: number}, 'a'>>().equals<false>();
    });

    it('handles a mix of optional and required members', () => {
        assert.tsType<IsOptionalKeyOf<MixedMembers, 'x'>>().equals<true>();
        assert.tsType<IsOptionalKeyOf<MixedMembers, 'y'>>().equals<false>();
    });

    it('handles symbol keys', () => {
        assert
            .tsType<IsOptionalKeyOf<{[symbolKey]?: number; a: string}, typeof symbolKey>>()
            .equals<true>();
        assert.tsType<IsOptionalKeyOf<{[symbolKey]?: number; a: string}, 'a'>>().equals<false>();
    });

    it('handles methods and fully optional objects', () => {
        assert.tsType<IsOptionalKeyOf<{name: string; run?: () => void}, 'run'>>().equals<true>();
        assert.tsType<IsOptionalKeyOf<{name: string; run?: () => void}, 'name'>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<Partial<{a: number; b: string}>, 'a'>>().equals<true>();
        assert.tsType<IsOptionalKeyOf<Partial<{a: number; b: string}>, 'b'>>().equals<true>();
    });

    it('treats required-but-undefined keys as not optional', () => {
        assert.tsType<IsOptionalKeyOf<{a: string | undefined; b?: number}, 'a'>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<{a: string | undefined; b?: number}, 'b'>>().equals<true>();
    });

    it('resolves unions of keys', () => {
        assert.tsType<IsOptionalKeyOf<BaseObject, 'b' | 'c'>>().equals<boolean>();
        assert.tsType<IsOptionalKeyOf<BaseObject, 'a' | 'b'>>().equals<boolean>();
        assert.tsType<IsOptionalKeyOf<BaseObject, 'a' | 'c'>>().equals<false>();
        assert.tsType<IsOptionalKeyOf<BaseObject, keyof BaseObject>>().equals<boolean>();
        // @ts-expect-error: `d` is not a key of `BaseObject`.
        assert.tsType<IsOptionalKeyOf<BaseObject, 'a' | 'd'>>().equals<false>();
        // @ts-expect-error: `x` is not a key of `BaseObject`.
        assert.tsType<IsOptionalKeyOf<BaseObject, 'b' | 'x'>>().equals<boolean>();
    });

    it('is never for any or never inputs', () => {
        assert.tsType<IsOptionalKeyOf<{a?: string}, any>>().equals<never>();
        assert.tsType<IsOptionalKeyOf<any, any>>().equals<never>();
        assert.tsType<IsOptionalKeyOf<any, 'a'>>().equals<never>();
        assert.tsType<IsOptionalKeyOf<{a?: string}, never>>().equals<never>();
        assert.tsType<IsOptionalKeyOf<any, never>>().equals<never>();
        assert.tsType<IsOptionalKeyOf<never, 'a'>>().equals<never>();
    });
});
