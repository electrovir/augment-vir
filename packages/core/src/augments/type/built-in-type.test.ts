import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type BuiltIns, type HasMultipleCallSignatures} from './built-in-type.js';

type SingleSignature = (input: number) => string;

type SingleSignatureWithProperties = {
    (input: number): string;
    extra: boolean;
};

type OverloadedSignature = {
    (input: number): string;
    (input: string): number;
};

describe('BuiltIns', () => {
    it('matches primitive values', () => {
        assert.tsType<string>().matches<BuiltIns>();
        assert.tsType<number>().matches<BuiltIns>();
        assert.tsType<boolean>().matches<BuiltIns>();
        assert.tsType<bigint>().matches<BuiltIns>();
        assert.tsType<symbol>().matches<BuiltIns>();
        assert.tsType<null>().matches<BuiltIns>();
        assert.tsType<undefined>().matches<BuiltIns>();
    });

    it('matches void, Date, and RegExp', () => {
        assert.tsType<void>().matches<BuiltIns>();
        assert.tsType<Date>().matches<BuiltIns>();
        assert.tsType<RegExp>().matches<BuiltIns>();
    });

    it('does not match plain objects, arrays, or other classes', () => {
        assert.tsType<{a: number}>().notMatches<BuiltIns>();
        assert.tsType<number[]>().notMatches<BuiltIns>();
        assert.tsType<Map<string, number>>().notMatches<BuiltIns>();
    });
});

describe('HasMultipleCallSignatures', () => {
    it('returns false for a single call signature', () => {
        assert.tsType<HasMultipleCallSignatures<SingleSignature>>().equals<false>();
    });

    it('returns false for a single call signature with properties', () => {
        assert.tsType<HasMultipleCallSignatures<SingleSignatureWithProperties>>().equals<false>();
    });

    it('returns true for an overloaded function', () => {
        assert.tsType<HasMultipleCallSignatures<OverloadedSignature>>().equals<true>();
    });
});
