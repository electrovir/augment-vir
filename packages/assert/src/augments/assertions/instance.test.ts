import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('instanceOf', () => {
    const actualPass: unknown = /one/ as any;
    const actualReject: unknown = 'one' as any;
    const expected = RegExp;
    type ExpectedType = RegExp;
    type UnexpectedType = string;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.instanceOf(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.instanceOf(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.instanceOf(actualPass, expected));

            if (check.instanceOf(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.instanceOf(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.instanceOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.instanceOf(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.instanceOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.instanceOf(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.instanceOf(
                expected,
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
                waitUntil.instanceOf(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('notInstanceOf', () => {
    const actualPass: RegExp | string = 'hi' as any;
    const actualReject: RegExp | string = /hi/ as any;
    const expected = RegExp;
    type ExpectedType = string;
    type UnexpectedType = RegExp;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.notInstanceOf(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.notInstanceOf(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.notInstanceOf(actualPass, expected));

            if (check.notInstanceOf(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.notInstanceOf(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.notInstanceOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.notInstanceOf(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.notInstanceOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.notInstanceOf(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.notInstanceOf(
                expected,
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
                waitUntil.notInstanceOf(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
