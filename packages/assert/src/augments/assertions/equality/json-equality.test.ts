import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../../guards/assert-wrap.js';
import {assert} from '../../guards/assert.js';
import {checkWrap} from '../../guards/check-wrap.js';
import {check} from '../../guards/check.js';
import {waitUntil} from '../../guards/wait-until.js';
import {waitUntilTestOptions} from '../../test-timeout.mock.js';

describe('jsonEquals', () => {
    const actualPass: unknown = {
        checks: {
            deep: {
                equality: true,
            },
        },
        ignores: {
            nonJson: 'props',
            value: new Map([
                [
                    'a',
                    'b',
                ],
                [
                    'c',
                    'd',
                ],
            ]),
        },
    } as any;
    const actualReject: unknown = {
        checks: {
            deep: {
                equality: false,
            },
        },
        ignores: {
            nonJson: 'props',
            value: new Map([
                [
                    'a',
                    'b',
                ],
                [
                    'c',
                    'd',
                ],
            ]),
        },
    } as any;
    const expected = {
        checks: {
            deep: {
                equality: true,
            },
        },
        ignores: {
            nonJson: 'props',
            value: new Map([
                [
                    'q',
                    'r',
                ],
            ]),
        },
    };
    type ExpectedType = {
        checks: {
            deep: {
                equality: boolean;
            };
        };
        ignores: {
            nonJson: string;
            value: Map<string, string>;
        };
    };
    type UnexpectedType = {
        checks: boolean;
    };

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.jsonEquals(actualPass, expected);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.jsonEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.jsonEquals(actualPass, expected));

            if (check.jsonEquals(actualPass, expected)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.jsonEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.jsonEquals(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.jsonEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.jsonEquals(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.jsonEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.jsonEquals(
                expected,
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
                waitUntil.jsonEquals(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
