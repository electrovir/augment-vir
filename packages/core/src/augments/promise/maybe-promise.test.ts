import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type MaybePromise} from './maybe-promise.js';

describe('MaybePromise', () => {
    it('wraps in a promise', () => {
        assert.tsType<MaybePromise<string>>().equals<string | Promise<string>>();
        /** You have manually unwrap nested promises. */
        assert.tsType<MaybePromise<Promise<string>>>().notEquals<string | Promise<string>>();
    });
});
