import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isDefined', () => {
    const actualPass: undefined | string = 'one' as any;
    const actualReject: undefined | string = undefined as any;
    type ExpectedType = string;
    type UnexpectedType = string | undefined;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isDefined(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isDefined(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isDefined(actualPass));

            if (check.isDefined(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isDefined(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isDefined(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isDefined(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('does not exist', () => {
            // @ts-expect-error: checkWrap.isDefined does not exist
            assert.isUndefined(checkWrap.isDefined);
            checkWrap;
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isDefined(
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
                waitUntil.isDefined(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('isNullish', () => {
    const actualPass: null | string = null as any;
    const actualReject: null | string = 'one' as any;
    type ExpectedType = null;
    type UnexpectedType = string;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNullish(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNullish(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNullish(actualPass));

            if (check.isNullish(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNullish(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNullish(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNullish(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            it('does not exist', () => {
                // @ts-expect-error: checkWrap.isNullish does not exist
                assert.isUndefined(checkWrap.isNullish);
                checkWrap;
            });
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNullish(
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
                waitUntil.isNullish(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
