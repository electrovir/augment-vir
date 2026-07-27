import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type UnionToIntersection} from './union-to-intersection.js';

describe('UnionToIntersection', () => {
    it('merges a union of object types into an intersection', () => {
        assert
            .tsType<UnionToIntersection<{a: string} | {b: number}>>()
            .matches<{a: string; b: number}>();
    });

    it('creates a union of matching properties', () => {
        assert
            .tsType<UnionToIntersection<{a: string} | {b: number} | {a: () => void}>>()
            .matches<{a: string | (() => void); b: number}>();
    });
});
