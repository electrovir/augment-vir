import type {Tuple} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';
import type {AtLeastTuple} from './array.js';

describe('isLengthAtLeast', () => {
    const actualPass: string[] = [
        'a',
        'b',
        'c',
    ] as any;
    const actualReject: string[] = [
        'a',
        'c',
    ] as any;
    const expected = 3;
    type ExpectedType = AtLeastTuple<string, 3>;
    type UnexpectedType = string[];

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isLengthAtLeast(actualPass, expected);

            assert.tsType(actualPass).matches<ExpectedType>();
            assert.tsType(actualPass[1]).equals<string>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isLengthAtLeast(actualPass, expected));

            if (check.isLengthAtLeast(actualPass, expected)) {
                assert.tsType(actualPass).matches<ExpectedType>();
                assert.tsType(actualPass[1]).equals<string>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isLengthAtLeast(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(newValue[1]).equals<string>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isLengthAtLeast(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            assert.tsType(newValue![1]).equals<string>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isLengthAtLeast(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(newValue[1]).equals<string>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isLengthAtLeast(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('isLengthExactly', () => {
    const actualPass: string[] = [
        'a',
        'b',
        'c',
    ] as any;
    const actualReject: string[] = [
        'a',
        'c',
    ] as any;
    const expected = 3;
    type ExpectedType = Tuple<string, 3>;
    type UnexpectedType = string[];

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isLengthExactly(actualPass, expected);

            assert.tsType(actualPass).matches<ExpectedType>();
            assert.tsType(actualPass[1]).equals<string>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isLengthExactly(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isLengthExactly(actualPass, expected));

            if (check.isLengthExactly(actualPass, expected)) {
                assert.tsType(actualPass).matches<ExpectedType>();
                assert.tsType(actualPass[1]).equals<string>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isLengthExactly(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isLengthExactly(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(newValue[1]).equals<string>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isLengthExactly(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isLengthExactly(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            assert.tsType(newValue![1]).equals<string>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isLengthExactly(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isLengthExactly(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(newValue[1]).equals<string>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isLengthExactly(
                    expected,
                    () => actualReject,
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('AtLeastTuple', () => {
    it('should be assignable to from a Tuple', () => {
        const atLeastTuple: AtLeastTuple<any, 5> = [
            1,
            2,
            3,
            4,
            5,
        ] as Tuple<any, 5>;
    });
    it('should not be assignable to a Tuple', () => {
        // @ts-expect-error: `AtLeastTuple` can be bigger than `Tuple`
        const strictTuple: Tuple<any, 5> = [
            1,
            2,
            3,
            4,
            5,
        ] as AtLeastTuple<any, 5>;
    });

    it('should match arrays with more than the expected length', () => {
        assert
            .tsType([
                1,
                2,
                3,
                4,
                5,
                6,
                7,
            ] as const)
            .matches<AtLeastTuple<any, 5>>();
        assert
            .tsType([
                1,
                2,
                3,
            ] as const)
            .notMatches<AtLeastTuple<any, 5>>();
    });
});
