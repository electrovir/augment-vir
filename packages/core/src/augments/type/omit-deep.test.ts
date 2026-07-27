import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type OmitDeep} from './omit-deep.js';

describe('OmitDeep', () => {
    it('omits a top-level key', () => {
        assert.tsType<OmitDeep<{a: number; b: string}, 'a'>>().equals<{b: string}>();
    });

    it('omits a deeply-nested key', () => {
        assert.tsType<OmitDeep<{a: {b: number; c: string}}, 'a.b'>>().equals<{a: {c: string}}>();
    });

    it('omits multiple paths at once', () => {
        assert
            .tsType<OmitDeep<{a: {b: number; c: string}; d: boolean}, 'a.b' | 'd'>>()
            .equals<{a: {c: string}}>();
    });

    it('omits a key from every element of an array via a numeric index', () => {
        assert
            .tsType<OmitDeep<{items: Array<{id: number; name: string}>}, `items.${number}.name`>>()
            .equals<{items: Array<{id: number}>}>();
    });

    it('leaves the type unchanged when the path does not exist', () => {
        assert.tsType<OmitDeep<{a: {b: number}}, 'a.z'>>().equals<{a: {b: number}}>();
    });
});
