import {describe, it} from '@augment-vir/test';
import {AssertionError} from '../assertion.error.js';
import {assert} from './assert.js';

describe(assert.name, () => {
    it('can be used directly as a function', () => {
        assert(true);
        assert.throws(() => assert(false));
    });
    it('combines error messages', () => {
        assert.throws(() => assert.isApproximately(1, 4, 1, 'fake message'), {
            matchMessage: 'fake message: 1 is not within ±1 of 4',
        });
    });
});

describe('assert.fail', () => {
    it('throws an error', () => {
        assert.throws(() => assert.fail(), {matchConstructor: AssertionError});
    });
});
