import type {AnyFunction} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isPromise', () => {
    const actualPass: Promise<string> | string = Promise.resolve('one') as any;
    const actualReject: Promise<string> | string = 'two' as any;
    type ExpectedType = Promise<string>;
    type UnexpectedType = string;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isPromise(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isPromise(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isPromise(actualPass));

            if (check.isPromise(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isPromise(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isPromise(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf<Awaited<typeof newValue>>().not.toBeAny();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            void assert.throws(() => assertWrap.isPromise(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isPromise(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isPromise(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isPromise(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            /** This is not a promise because the `await` in `waitUntil` unwraps the promise. */
            assert.typeOf(newValue).toBeString();
            assert.typeOf(newValue).not.toEqualTypeOf<Promise<string>>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isPromise(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('isPromiseLike', () => {
    class CustomThenable {
        constructor(public value: any) {}

        // eslint-disable-next-line unicorn/no-thenable
        then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
            return new CustomThenable(onFulfilled ? onFulfilled(this.value) : this.value);
        }
    }

    const actualPass: PromiseLike<string> | string = new CustomThenable('hi') as any;
    const actualReject: PromiseLike<string> | string = 'two' as any;
    type ExpectedType = PromiseLike<string>;
    type UnexpectedType = string;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isPromiseLike(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isPromiseLike(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isPromiseLike(actualPass));

            if (check.isPromiseLike(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isPromiseLike(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isPromiseLike(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf<Awaited<typeof newValue>>().not.toBeAny();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isPromiseLike(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isPromiseLike(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isPromiseLike(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            // actualPass;
            const newValue = await waitUntil.isPromiseLike(() => actualPass);
            /** This is not a promise because the `await` in `waitUntil` unwraps the promise. */
            assert.typeOf(newValue).toBeString();
            assert.typeOf(newValue).not.toEqualTypeOf<Promise<unknown>>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isPromiseLike(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
