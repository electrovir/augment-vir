import {describe, it, itCases} from '@augment-vir/test';
import {assertWrap} from '../../augments/guards/assert-wrap.js';
import {assert} from '../../augments/guards/assert.js';
import {checkWrap} from '../../augments/guards/check-wrap.js';
import {check} from '../../augments/guards/check.js';
import {waitUntil} from '../../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../../test-timeout.mock.js';

describe('entriesEqual', () => {
    const actualPass: object = {
        a: 'first',
        b: 'second',
    } as any;
    const actualReject: object = {
        a: 'last',
        b: 'second',
    } as any;
    const expected = {a: 'first', b: 'second'};
    type ExpectedType = {a: string; b: string};

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.entriesEqual(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.entriesEqual(actualReject, expected));
        });
        itCases(assert.entriesEqual, [
            {
                it: 'handles a non-object first arg',
                inputs: ['hi' as any, {a: 'hi'}],
                throws: {
                    matchMessage: 'is not an object',
                },
            },
            {
                it: 'handles a non-object second arg',
                inputs: [{a: 'hi'}, 'hi' as any],
                throws: {
                    matchMessage: 'is not an object',
                },
            },
        ]);
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.entriesEqual(actualPass, expected));

            if (check.entriesEqual(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.entriesEqual(actualReject, expected));

            // @ts-expect-error: intentionally incorrect input
            assert.isFalse(check.entriesEqual(null, {}));
            // @ts-expect-error: intentionally incorrect input
            assert.isFalse(check.entriesEqual('hi', {}));
            // @ts-expect-error: intentionally incorrect input
            assert.isFalse(check.entriesEqual({}, null));
            assert.isFalse(check.entriesEqual({}, 'hi'));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.entriesEqual(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.entriesEqual(actualReject, expected));

            // @ts-expect-error: intentionally incorrect input
            assert.throws(() => assertWrap.entriesEqual(null, {}));
            // @ts-expect-error: intentionally incorrect input
            assert.throws(() => assertWrap.entriesEqual('hi', {}));
            // @ts-expect-error: intentionally incorrect input
            assert.throws(() => assertWrap.entriesEqual({}, null));
            assert.throws(() => assertWrap.entriesEqual({}, 'hi'));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.entriesEqual(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            // @ts-expect-error: intentionally invalid input
            assert.isUndefined(checkWrap.entriesEqual(null, {}));
            // @ts-expect-error: intentionally invalid input
            assert.isUndefined(checkWrap.entriesEqual('hi', {}));
            // @ts-expect-error: intentionally invalid input
            assert.isUndefined(checkWrap.entriesEqual({}, null));
            assert.isUndefined(checkWrap.entriesEqual({}, 'hi'));
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

describe('notEntriesEqual', () => {
    const actualPass = {
        a: 'first',
        b: 'second',
    } as any;
    const actualReject = {
        a: 'first',
        c: 'second',
    } as any;
    const expected = {a: 'first', c: 'second'};

    describe('assert', () => {
        it('accepts', () => {
            assert.notEntriesEqual(actualPass, expected);

            // @ts-expect-error: intentionally incorrect input
            assert.notEntriesEqual(null, {});
            // @ts-expect-error: intentionally incorrect input
            assert.notEntriesEqual('hi', {});
            // @ts-expect-error: intentionally incorrect input
            assert.notEntriesEqual({}, null);
            // @ts-expect-error: intentionally incorrect input
            assert.notEntriesEqual({}, 'hi');
        });
        it('rejects', () => {
            assert.throws(() => assert.notEntriesEqual(actualReject, expected));
        });
    });
    describe('check', () => {
        it('accepts', () => {
            assert.isTrue(check.notEntriesEqual(actualPass, expected));

            // @ts-expect-error: intentionally incorrect input
            assert.isTrue(check.notEntriesEqual(null, {}));
            // @ts-expect-error: intentionally incorrect input
            assert.isTrue(check.notEntriesEqual('hi', {}));
            // @ts-expect-error: intentionally incorrect input
            assert.isTrue(check.notEntriesEqual({}, null));
            // @ts-expect-error: intentionally incorrect input
            assert.isTrue(check.notEntriesEqual({}, 'hi'));
        });
        it('rejects', () => {
            assert.isFalse(check.notEntriesEqual(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('accepts', () => {
            const newValue = assertWrap.notEntriesEqual(actualPass, expected);
            assert.tsType(newValue).equals(actualPass);
            assert.deepEquals(actualPass, newValue);

            // @ts-expect-error: intentionally incorrect input
            assert.strictEquals(assertWrap.notEntriesEqual(null, {}), null);
            // @ts-expect-error: intentionally incorrect input
            assert.strictEquals(assertWrap.notEntriesEqual('', {}), '');
            // @ts-expect-error: intentionally incorrect input
            assert.deepEquals(assertWrap.notEntriesEqual({}, null), {});
            // @ts-expect-error: intentionally incorrect input
            assert.deepEquals(assertWrap.notEntriesEqual({}, null), {});
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.notEntriesEqual(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('accepts', () => {
            const newValue = checkWrap.notEntriesEqual(actualPass, expected);
            assert.deepEquals(newValue, actualPass);

            assert.tsType(newValue).equals(actualPass);

            // @ts-expect-error: intentionally invalid input
            assert.isNull(checkWrap.notEntriesEqual(null, {}));
            // @ts-expect-error: intentionally invalid input
            assert.strictEquals(checkWrap.notEntriesEqual('', {}), '');
            // @ts-expect-error: intentionally invalid input
            assert.deepEquals(checkWrap.notEntriesEqual({}, null), {});
            // @ts-expect-error: intentionally invalid input
            assert.deepEquals(checkWrap.notEntriesEqual({}, ''), {});
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.notEntriesEqual(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('accepts', async () => {
            const newValue = await waitUntil.notEntriesEqual(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', async () => {
            await assert.throws(() =>
                waitUntil.notEntriesEqual(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
