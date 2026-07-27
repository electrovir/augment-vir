import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type KeysOfUnion} from './keys-of-union.js';

type Example1 = {
    string: string;
    number: number;
    boolean: boolean;
    null: null;
    array: number[];
};

type Example2 =
    | {
          common: string;
          a: number;
      }
    | {
          common: string;
          b: string;
      }
    | {
          common: string;
          c: boolean;
      };

describe('KeysOfUnion', () => {
    it('behaves like keyof for non-union types', () => {
        assert.tsType<KeysOfUnion<Example1>>().equals<keyof Example1>();
    });

    it('returns a union of all keys of all union members', () => {
        assert.tsType<KeysOfUnion<Example2>>().equals<'common' | 'a' | 'b' | 'c'>();
    });

    it('handles property modifiers', () => {
        assert
            .tsType<KeysOfUnion<{a?: string; readonly b: number} | {a: number; b: string}>>()
            .equals<'a' | 'b'>();
    });

    it('is not assignable to keyof for a union', () => {
        assert.tsType<KeysOfUnion<Example2>>().notMatches<keyof Example2>();
    });

    it('accepts keyof as assignable to it', () => {
        assert.tsType<keyof Example2>().matches<KeysOfUnion<Example2>>();
    });

    it('is assignable to PropertyKey', () => {
        assert.tsType<KeysOfUnion<Example2>>().matches<PropertyKey>();
    });

    it('does not accept PropertyKey as assignable to it', () => {
        assert.tsType<PropertyKey>().notMatches<KeysOfUnion<Example2>>();
    });
});
