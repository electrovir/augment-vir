import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../../guards/assert-wrap.js';
import {assert} from '../../guards/assert.js';
import {checkWrap} from '../../guards/check-wrap.js';
import {check} from '../../guards/check.js';
import {waitUntil} from '../../guards/wait-until.js';
import {waitUntilTestOptions} from '../../test-timeout.mock.js';

describe('entriesEqual', () => {
    const actualPass: unknown = {
        a: 'first',
        b: 'second',
    } as any;
    const actualReject: unknown = {
        a: 'last',
        b: 'second',
    } as any;
    const expected = {a: 'first', b: 'second'};
    type ExpectedType = {a: string; b: string};

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.entriesEqual(actualPass, expected);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.entriesEqual(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.entriesEqual(actualPass, expected));

            if (check.entriesEqual(actualPass, expected)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.entriesEqual(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.entriesEqual(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.entriesEqual(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.entriesEqual(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.entriesEqual(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.entriesEqual(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(() =>
                waitUntil.entriesEqual(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
