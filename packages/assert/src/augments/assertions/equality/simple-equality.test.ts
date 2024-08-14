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
    const expected: string = '1';
    type ExpectedType = string;
    type UnexpectedType = number;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.strictEquals(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.strictEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.strictEquals(actualPass, expected));

            if (check.strictEquals(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.strictEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.strictEquals(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.strictEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.strictEquals(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

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

describe('notStrictEquals', () => {
    const actualPass = 'first';
    const actualReject: unknown = 'last';
    const expected = 'last';

    describe('assert', () => {
        it('accepts', () => {
            assert.notStrictEquals(actualPass, expected);
        });
        it('rejects', () => {
            assert.throws(() => assert.notStrictEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('accepts', () => {
            assert.isTrue(check.notStrictEquals(actualPass, expected));
        });
        it('rejects', () => {
            assert.isFalse(check.notStrictEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('accepts', () => {
            const newValue = assertWrap.notStrictEquals(actualPass, expected);
            assert.tsType(newValue).equals(actualPass);
            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.notStrictEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('accepts', () => {
            const newValue = checkWrap.notStrictEquals(actualPass, expected);
            assert.deepEquals(newValue, actualPass);

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.notStrictEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('accepts', async () => {
            const newValue = await waitUntil.notStrictEquals(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', async () => {
            await assert.throws(() =>
                waitUntil.notStrictEquals(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('looseEquals', () => {
    const actualPass: unknown = '1' as any;
    const actualReject: unknown = 'one' as any;
    const expected = 1;
    type ExpectedType = string;
    type UnexpectedType = number;

    describe('assert', () => {
        it('guards without types', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.looseEquals(actualPass, expected);

            assert.tsType(actualPass).notEquals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.looseEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards without types', () => {
            assert.isTrue(check.looseEquals(actualPass, expected));

            if (check.looseEquals(actualPass, expected)) {
                assert.tsType(actualPass).notEquals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.looseEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards without types', () => {
            const newValue = assertWrap.looseEquals(actualPass, expected);

            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.looseEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards without types', () => {
            const newValue = checkWrap.looseEquals(actualPass, expected);

            assert.tsType(newValue).notEquals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

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

describe('notLooseEquals', () => {
    const actualPass = 'first';
    const actualReject: unknown = 'last';
    const expected = 'last';

    describe('assert', () => {
        it('accepts', () => {
            assert.notLooseEquals(actualPass, expected);
        });
        it('rejects', () => {
            assert.throws(() => assert.notLooseEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('accepts', () => {
            assert.isTrue(check.notLooseEquals(actualPass, expected));
        });
        it('rejects', () => {
            assert.isFalse(check.notLooseEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('accepts', () => {
            const newValue = assertWrap.notLooseEquals(actualPass, expected);
            assert.tsType(newValue).equals(actualPass);
            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.notLooseEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('accepts', () => {
            const newValue = checkWrap.notLooseEquals(actualPass, expected);
            assert.deepEquals(newValue, actualPass);

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.notLooseEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('accepts', async () => {
            const newValue = await waitUntil.notLooseEquals(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', async () => {
            await assert.throws(() =>
                waitUntil.notLooseEquals(
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.deepEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.deepEquals(actualPass, expected));

            if (check.deepEquals(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.deepEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.deepEquals(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.deepEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.deepEquals(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.deepEquals(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('notDeepEquals', () => {
    const actualPass = {
        a: 'first',
        b: 'second',
    };
    const actualReject: unknown = {
        a: 'first',
        c: 'second',
    };
    const expected = {a: 'first', c: 'second'};

    describe('assert', () => {
        it('accepts', () => {
            assert.notDeepEquals(actualPass, expected);
        });
        it('rejects', () => {
            assert.throws(() => assert.notDeepEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('accepts', () => {
            assert.isTrue(check.notDeepEquals(actualPass, expected));
        });
        it('rejects', () => {
            assert.isFalse(check.notDeepEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('accepts', () => {
            const newValue = assertWrap.notDeepEquals(actualPass, expected);
            assert.tsType(newValue).equals(actualPass);
            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.notDeepEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('accepts', () => {
            const newValue = checkWrap.notDeepEquals(actualPass, expected);
            assert.deepEquals(newValue, actualPass);

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.notDeepEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('accepts', async () => {
            const newValue = await waitUntil.notDeepEquals(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', async () => {
            await assert.throws(() =>
                waitUntil.notDeepEquals(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
