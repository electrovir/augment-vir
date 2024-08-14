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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isPromise(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isPromise(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isPromise(actualPass));

            if (check.isPromise(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isPromise(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isPromise(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType<Awaited<typeof newValue>>().notEquals<any>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            void assert.throws(() => assertWrap.isPromise(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isPromise(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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
            assert.tsType(newValue).equals<string>();
            assert.tsType(newValue).notEquals<Promise<string>>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isPromise(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isNotPromise', () => {
    const actualPass: Promise<string> | string = 'one' as any;
    const actualReject: Promise<string> | string = Promise.resolve('two') as any;
    type ExpectedType = string;
    type UnexpectedType = Promise<string>;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotPromise(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotPromise(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotPromise(actualPass));

            if (check.isNotPromise(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotPromise(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotPromise(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType<Awaited<typeof newValue>>().notEquals<any>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotPromise(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotPromise(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotPromise(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotPromise(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            /** This is not a promise because the `await` in `waitUntil` unwraps the promise. */
            assert.tsType(newValue).equals<string>();
            assert.tsType(newValue).notEquals<Promise<string>>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotPromise(() => actualReject, waitUntilTestOptions, 'failure'),
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isPromiseLike(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isPromiseLike(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isPromiseLike(actualPass));

            if (check.isPromiseLike(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isPromiseLike(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isPromiseLike(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType<Awaited<typeof newValue>>().notEquals<any>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isPromiseLike(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isPromiseLike(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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
            assert.tsType(newValue).equals<string>();
            assert.tsType(newValue).notEquals<Promise<unknown>>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isPromiseLike(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isNotPromiseLike', () => {
    class CustomThenable {
        constructor(public value: any) {}

        // eslint-disable-next-line unicorn/no-thenable
        then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
            return new CustomThenable(onFulfilled ? onFulfilled(this.value) : this.value);
        }
    }

    const actualPass: PromiseLike<string> | string = 'hi' as any;
    const actualReject: PromiseLike<string> | string = new CustomThenable('hi') as any;
    type ExpectedType = string;
    type UnexpectedType = PromiseLike<string>;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotPromiseLike(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotPromiseLike(actualReject));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotPromiseLike(actualPass));

            if (check.isNotPromiseLike(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotPromiseLike(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotPromiseLike(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType<Awaited<typeof newValue>>().notEquals<any>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotPromiseLike(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotPromiseLike(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotPromiseLike(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            // actualPass;
            const newValue = await waitUntil.isNotPromiseLike(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );
            /** This is not a promise because the `await` in `waitUntil` unwraps the promise. */
            assert.tsType(newValue).equals<string>();
            assert.tsType(newValue).notEquals<Promise<unknown>>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotPromiseLike(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
