import {describe, it, itCases} from '@augment-vir/test';
import {assertWrap} from '../../augments/guards/assert-wrap.js';
import {assert} from '../../augments/guards/assert.js';
import {checkWrap} from '../../augments/guards/check-wrap.js';
import {check} from '../../augments/guards/check.js';
import {waitUntil} from '../../augments/guards/wait-until.js';
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.jsonEquals(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.jsonEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.jsonEquals(actualPass, expected));

            if (check.jsonEquals(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.jsonEquals(actualReject, expected));
        });

        itCases(check.jsonEquals, [
            {
                it: 'handles empty first arg',
                inputs: [
                    {},
                    {a: 'b'},
                ],
                expect: false,
            },
            {
                it: 'handles empty last arg',
                inputs: [
                    {a: 'b'},
                    {},
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.jsonEquals(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.jsonEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.jsonEquals(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.jsonEquals(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('notJsonEquals', () => {
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
            assert.notJsonEquals(actualPass, expected);
        });
        it('rejects', () => {
            assert.throws(() => assert.notJsonEquals(actualReject, expected));
        });
    });
    describe('check', () => {
        it('accepts', () => {
            assert.isTrue(check.notJsonEquals(actualPass, expected));
        });
        it('rejects', () => {
            assert.isFalse(check.notJsonEquals(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('accepts', () => {
            const newValue = assertWrap.notJsonEquals(actualPass, expected);
            assert.tsType(newValue).equals(actualPass);
            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.notJsonEquals(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('accepts', () => {
            const newValue = checkWrap.notJsonEquals(actualPass, expected);
            assert.deepEquals(newValue, actualPass);

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.notJsonEquals(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('accepts', async () => {
            const newValue = await waitUntil.notJsonEquals(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals(actualPass);
        });
        it('rejects', async () => {
            await assert.throws(() =>
                waitUntil.notJsonEquals(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
