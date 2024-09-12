import {assert} from '@augment-vir/assert';
import type {AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {KeyCount} from './key-count.js';

describe('KeyCount', () => {
    it('counts keys', () => {
        assert.tsType<KeyCount<Record<'a' | 'b' | 'c' | 'd', any>>>().equals<4>();
        const value = {a: 'hi', b: 'c'};
        assert.tsType<KeyCount<typeof value>>().equals<2>();
        assert.tsType<KeyCount<Record<string, any>>>().equals<1>();
        assert.tsType<KeyCount<AnyObject>>().equals<3>();
    });

    it('does not work on arrays', () => {
        assert.tsType<KeyCount<['hi', 'b']>>().notEquals<2>();
    });
});
