import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Exact} from './exact.js';

describe('Exact', () => {
    it('passes an exactly-matching object through', () => {
        assert
            .tsType<{a: number; b: string}>()
            .matches<Exact<{a: number; b: string}, {a: number; b: string}>>();
    });

    it('rejects objects with extra properties', () => {
        assert
            .tsType<{a: number; b: string}>()
            .notMatches<Exact<{a: number}, {a: number; b: string}>>();
    });

    it('passes primitives through unchanged', () => {
        assert.tsType<Exact<string, string>>().equals<string>();
        assert.tsType<Exact<number, number>>().equals<number>();
    });

    it('recurses into nested objects', () => {
        assert
            .tsType<{a: {b: number; c: string}}>()
            .notMatches<Exact<{a: {b: number}}, {a: {b: number; c: string}}>>();
    });

    it('recurses into arrays', () => {
        assert
            .tsType<Array<{a: number; b: string}>>()
            .notMatches<Exact<Array<{a: number}>, Array<{a: number; b: string}>>>();
    });
});
