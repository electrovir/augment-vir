import {describe, it} from '@augment-vir/test';
import {assertWrap} from './assert-wrap.js';
import {assert} from './assert.js';

describe(assertWrap.name, () => {
    it('has a name', () => {
        assert.strictEquals(assertWrap.name, 'assertWrap');
    });

    it('is a standalone function', () => {
        assert.throws(() => assertWrap(''));
        assert.strictEquals(assertWrap('hi'), 'hi');
    });
});
