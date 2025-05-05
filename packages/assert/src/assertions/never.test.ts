import {type AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';

describe('never', () => {
    describe('assert', () => {
        it('errors', () => {
            assert.throws(() => assert.never());
        });
    });
    describe('check', () => {
        it('does not exist', () => {
            assert.lacksKey(check, 'never');
            assert.isUndefined((check as AnyObject).never);
            // @ts-expect-error: this property should not exist
            check.never;
        });
    });
    describe('assertWrap', () => {
        it('does not exist', () => {
            assert.lacksKey(assertWrap, 'never');
            assert.isUndefined((assertWrap as AnyObject).never);
            // @ts-expect-error: this property should not exist
            assertWrap.never;
        });
    });
    describe('checkWrap', () => {
        it('does not exist', () => {
            assert.lacksKey(checkWrap, 'never');
            assert.isUndefined((checkWrap as AnyObject).never);
            // @ts-expect-error: this property should not exist
            checkWrap.never;
        });
    });
    describe('waitUntil', () => {
        it('does not exist', () => {
            assert.lacksKey(waitUntil, 'never');
            assert.isUndefined((waitUntil as AnyObject).never);
            // @ts-expect-error: this property should not exist
            waitUntil.never;
        });
    });
});
