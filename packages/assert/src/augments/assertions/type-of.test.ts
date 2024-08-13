/* eslint-disable @typescript-eslint/no-unused-expressions */
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';

describe('typeOf', () => {
    describe('assert', () => {
        it('should correctly type with toBeAssignableTo', () => {
            assert.typeOf<string>().toBeAssignableTo('');
            assert.typeOf('').toBeAssignableTo<string>();
            assert.typeOf('').toBeAssignableTo<string | number>();
            assert.typeOf('').not.toBeAssignableTo<number>();
        });
        it('does not fail the runtime', () => {
            // @ts-expect-error: intentional type failure
            assert.typeOf('').toBeAssignableTo<number>();
        });
    });
    describe('check', () => {
        it('does not exist', () => {
            // @ts-expect-error: does not exist
            assert.isUndefined(check.typeOf);
            check;
        });
    });
    describe('assertWrap', () => {
        it('does not exist', () => {
            // @ts-expect-error: does not exist
            assert.isUndefined(assertWrap.typeOf);
            assertWrap;
        });
    });
    describe('checkWrap', () => {
        it('does not exist', () => {
            // @ts-expect-error: does not exist
            assert.isUndefined(checkWrap.typeOf);
            checkWrap;
        });
    });
});
