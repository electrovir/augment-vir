import {describe, it} from '@augment-vir/test';
import {assert} from './assert.js';
import {checkWrap} from './check-wrap.js';

describe(checkWrap.name, () => {
    it('has a name', () => {
        assert.strictEquals(checkWrap.name, 'checkWrap');
    });

    it('is a standalone function', () => {
        assert.strictEquals(checkWrap('hi'), 'hi');
        assert.strictEquals(checkWrap(''), undefined);
    });
});
