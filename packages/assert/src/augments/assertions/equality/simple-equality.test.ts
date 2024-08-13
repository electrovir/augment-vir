import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../../guards/assert-wrap.js';
import {assert} from '../../guards/assert.js';
import {checkWrap} from '../../guards/check-wrap.js';
import {check} from '../../guards/check.js';
import {waitUntil} from '../../guards/wait-until.js';
import {waitUntilTestOptions} from '../../test-timeout.mock.js';

describe('strictEquals', () => {
    const actualPass: unknown = '1' as any;
    const actualReject: unknown = 1 as any;
    const expected = '1';
    type ExpectedType = string;
    type UnexpectedType = number;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.strictEquals(actualPass, expected);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.strictEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.strictEquals(actualPass, expected));

            if (check.strictEquals(actualPass, expected)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.strictEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.strictEquals(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.strictEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.strictEquals(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.strictEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.strictEquals(
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
                waitUntil.strictEquals(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('areLooseEqual', () => {
    const actualPass: unknown = '1' as any;
    const actualReject: unknown = 'one' as any;
    const expected = 1;
    type ExpectedType = string;
    type UnexpectedType = number;

    describe('assert', () => {
        it('guards without types', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.looseEquals(actualPass, expected);

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.looseEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards without types', () => {
            assert.isTrue(check.looseEquals(actualPass, expected));

            if (check.looseEquals(actualPass, expected)) {
                assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.looseEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards without types', () => {
            const newValue = assertWrap.looseEquals(actualPass, expected);

            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.looseEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards without types', () => {
            const newValue = checkWrap.looseEquals(actualPass, expected);

            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.looseEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards without types', async () => {
            const newValue = await waitUntil.looseEquals(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.looseEquals(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('deepEquals', () => {
    const actualPass: unknown = {
        checks: {
            deep: {
                equality: true,
            },
        },
        doesNotIgnore: {
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
                equality: true,
            },
        },
        doesNotIgnore: {
            nonJson: 'props',
            value: new Map([
                [
                    'a',
                    'r',
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
        doesNotIgnore: {
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
    };
    type ExpectedType = {
        checks: {
            deep: {
                equality: boolean;
            };
        };
        doesNotIgnore: {
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

            assert.deepEquals(actualPass, expected);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.deepEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.deepEquals(actualPass, expected));

            if (check.deepEquals(actualPass, expected)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.deepEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.deepEquals(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.deepEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.deepEquals(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.deepEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.deepEquals(
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
                waitUntil.deepEquals(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
