import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type SetOptional} from './set-optional.js';

describe('SetOptional', () => {
    it('makes selected required keys optional', () => {
        assert
            .tsType<SetOptional<{a: number; b: string; c: boolean}, 'b' | 'c'>>()
            .equals<{a: number; b?: string; c?: boolean}>();
    });

    it('leaves already-optional keys optional', () => {
        assert
            .tsType<SetOptional<{a: number; b?: string; c: boolean}, 'b'>>()
            .equals<{a: number; b?: string; c: boolean}>();
    });

    it('does not change value types', () => {
        assert
            .tsType<SetOptional<{a: number; b: string}, 'b'>>()
            .notMatches<{a: number; b?: number}>();
    });

    it('preserves the readonly modifier', () => {
        assert
            .tsType<SetOptional<{readonly a: number; b: string}, 'a'>>()
            .equals<{readonly a?: number; b: string}>();
    });

    it('does nothing when no keys are selected', () => {
        assert
            .tsType<SetOptional<{a: number; b: string}, never>>()
            .equals<{a: number; b: string}>();
    });

    it('distributes over unions', () => {
        assert
            .tsType<SetOptional<{a: 1; b: string} | {a: 2; b: string}, 'b'>>()
            .equals<{a: 1; b?: string} | {a: 2; b?: string}>();
    });
});
