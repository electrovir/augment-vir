import {describe, it} from '@augment-vir/test';
import {assert} from './assert.js';
import {check} from './check.js';

describe(check.name, () => {
    it('is a standalone function', () => {
        assert.isTrue(check('hi'));
        assert.isFalse(check(''));
    });

    it('has a name', () => {
        assert.strictEquals(check.name, 'check');
    });
});
