import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Merge} from './merge.js';

describe('Merge', () => {
    it('combines the keys of both types', () => {
        assert.tsType<Merge<{a: number}, {b: string}>>().equals<{a: number; b: string}>();
    });

    it('lets the source override the destination', () => {
        assert.tsType<Merge<{a: number; b: string}, {a: boolean}>>().equals<{
            a: boolean;
            b: string;
        }>();
    });

    it('replaces rather than unions an overridden key', () => {
        assert.tsType<Merge<{a: number}, {a: string}>>().equals<{a: string}>();
    });

    it('takes the optionality of the source for overridden keys', () => {
        assert.tsType<Merge<{a: number}, {a?: string}>>().equals<{a?: string}>();
        assert.tsType<Merge<{a?: number}, {a: string}>>().equals<{a: string}>();
    });

    it('merges index signatures separately from explicit keys', () => {
        assert.tsType<Merge<{[key: string]: unknown; a: number}, {b: string}>>().equals<{
            [key: string]: unknown;
            a: number;
            b: string;
        }>();
    });

    it('returns the type itself when both sides are equal', () => {
        assert.tsType<Merge<{a: number}, {a: number}>>().equals<{a: number}>();
    });

    it('distributes over unions on both sides', () => {
        assert
            .tsType<Merge<{a: 1} | {a: 2}, {b: string}>>()
            .equals<{a: 1; b: string} | {a: 2; b: string}>();
        assert
            .tsType<Merge<{a: number}, {b: 1} | {b: 2}>>()
            .equals<{a: number; b: 1} | {a: number; b: 2}>();
    });
});
