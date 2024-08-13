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
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isLengthAtLeast(actualPass, expected);

            assert.typeOf(actualPass).toMatchTypeOf<ExpectedType>();
            assert.typeOf(actualPass[1]).toBeString();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isLengthAtLeast(actualPass, expected));

            if (check.isLengthAtLeast(actualPass, expected)) {
                assert.typeOf(actualPass).toMatchTypeOf<ExpectedType>();
                assert.typeOf(actualPass[1]).toBeString();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isLengthAtLeast(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(newValue[1]).toBeString();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isLengthAtLeast(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isLengthAtLeast(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            assert.typeOf(newValue![1]).toBeString();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
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

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(newValue[1]).toBeString();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
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
            .typeOf([
                1,
                2,
                3,
                4,
                5,
                6,
                7,
            ] as const)
            .toBeAssignableTo<AtLeastTuple<any, 5>>();
        assert
            .typeOf([
                1,
                2,
                3,
            ] as const)
            .not.toBeAssignableTo<AtLeastTuple<any, 5>>();
    });
});
