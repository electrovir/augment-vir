import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isEnumValue', () => {
    const actualPass: unknown = 'a' as any;
    const actualReject: unknown = 'A' as any;

    enum MyEnum {
        A = 'a',
        B = 'b',
        C = 'c',
    }

    type ExpectedType = MyEnum;
    type UnexpectedType = string;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isEnumValue(actualPass, MyEnum);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isEnumValue(actualPass, MyEnum));

            if (check.isEnumValue(actualPass, MyEnum)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isEnumValue(actualPass, MyEnum);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isEnumValue(actualPass, MyEnum);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isEnumValue(
                MyEnum,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isEnumValue(MyEnum, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
