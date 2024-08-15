import type {Tuple} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';
import type {AtLeastTuple} from './length.js';

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
        it('works on strings', () => {
            assert.isLengthAtLeast('hi', 1);
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
        it('works on strings', () => {
            assert.isTrue(check.isLengthAtLeast('hi', 1));
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
        it('works on strings', () => {
            const newValue = assertWrap.isLengthAtLeast('hi', 1);
            assert.tsType(newValue).equals<'hi'>();
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
        it('works on strings', () => {
            const newValue = checkWrap.isLengthAtLeast('hi', 1);
            assert.tsType(newValue).equals<'hi' | undefined>();
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
        it('works on strings', async () => {
            const newValue = await waitUntil.isLengthAtLeast(
                1,
                () => 'hi',
                waitUntilTestOptions,
                'failure',
            );

            assert.strictEquals(newValue, 'hi');
            assert.tsType(newValue).equals<'hi'>();
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
        it('works on strings', () => {
            assert.isLengthExactly('hi', 2);
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
        it('works on strings', () => {
            assert.isTrue(check.isLengthExactly('hi', 2));
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
        it('works on strings', () => {
            assert.strictEquals(assertWrap.isLengthExactly('hi', 2), 'hi');
            assert.tsType(assertWrap.isLengthExactly('hi', 2)).equals<'hi'>();
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
        it('works on strings', () => {
            assert.strictEquals(assertWrap.isLengthExactly('hi', 2), 'hi');
            assert.tsType(checkWrap.isLengthExactly('hi', 2)).equals<'hi' | undefined>();
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
        it('works on strings', async () => {
            const newValue = await waitUntil.isLengthExactly(
                2,
                () => 'hi',
                waitUntilTestOptions,
                'failure',
            );

            assert.strictEquals(newValue, 'hi');
            assert.tsType(newValue).equals<'hi'>();
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
