import {HttpStatus, HttpStatusCategory} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isHttpStatus', () => {
    const actualPass: unknown = HttpStatus.Accepted as any;
    const actualReject: unknown = 24 as any;
    type ExpectedType = HttpStatus;
    type UnexpectedType = number;

    type ExpectedUnionNarrowedType = HttpStatus.Accepted | HttpStatus.BadRequest;
    const actualPassUnion: string | ExpectedUnionNarrowedType = HttpStatus.Accepted as any;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isHttpStatus(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isHttpStatus(actualReject));
        });
        it('narrows', () => {
            assert.isHttpStatus(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isHttpStatus(actualPass));

            if (check.isHttpStatus(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isHttpStatus(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isHttpStatus(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isHttpStatus(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isHttpStatus(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isHttpStatus(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isHttpStatus(
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
                waitUntil.isHttpStatus(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isHttpStatusCategory', () => {
    const actualPass: HttpStatus.Accepted | HttpStatus.BadGateway = HttpStatus.Accepted as any;
    const actualReject: HttpStatus.Accepted | HttpStatus.BadGateway = HttpStatus.BadGateway as any;
    const expected = HttpStatusCategory.Success;
    type ExpectedType = HttpStatus.Accepted;
    type UnexpectedType = HttpStatus.BadGateway;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isHttpStatusCategory(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isHttpStatusCategory(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards an array', () => {
            assert.isTrue(check.isHttpStatusCategory(actualPass, expected));

            if (check.isHttpStatusCategory(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isHttpStatusCategory(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards an array', () => {
            const newValue = assertWrap.isHttpStatusCategory(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isHttpStatusCategory(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards an array', () => {
            const newValue = checkWrap.isHttpStatusCategory(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isHttpStatusCategory(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards an array', async () => {
            const newValue = await waitUntil.isHttpStatusCategory(
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
                waitUntil.isHttpStatusCategory(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
