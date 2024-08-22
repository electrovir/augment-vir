import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isEnumValue(actualPass, MyEnum);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isEnumValue(actualPass, MyEnum));

            if (check.isEnumValue(actualPass, MyEnum)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isEnumValue(actualPass, MyEnum);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isEnumValue(actualReject, MyEnum));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isEnumValue(actualPass, MyEnum);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isEnumValue(MyEnum, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('isNotEnumValue', () => {
    const actualPass: 'a' | 'q' = 'q' as any;
    const actualReject: 'a' | 'q' = 'a' as any;

    enum MyEnum {
        A = 'a',
        B = 'b',
        C = 'c',
    }

    type ExpectedType = 'q';
    type UnexpectedType = MyEnum;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotEnumValue(actualPass, MyEnum);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotEnumValue(actualReject, MyEnum));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotEnumValue(actualPass, MyEnum));

            if (check.isNotEnumValue(actualPass, MyEnum)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotEnumValue(actualReject, MyEnum));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotEnumValue(actualPass, MyEnum);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotEnumValue(actualReject, MyEnum));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotEnumValue(actualPass, MyEnum);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotEnumValue(actualReject, MyEnum));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotEnumValue(
                MyEnum,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotEnumValue(
                    MyEnum,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
