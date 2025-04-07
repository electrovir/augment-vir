import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {ensureError, ensureErrorAndPrependMessage, ensureErrorClass} from './ensure-error.js';
import {extractErrorMessage} from './error-message.js';

describe(ensureError.name, () => {
    it('converts into an error', () => {
        const error = ensureError('not an error');
        assert.instanceOf(error, Error);
        assert.strictEquals(error.message, 'not an error');
    });
    it('passes through an error', () => {
        const error = new Error('this is an error');
        const ensuredError = ensureError(error);
        assert.strictEquals(error, ensuredError);
    });
});

describe(ensureErrorAndPrependMessage.name, () => {
    it('prepends a message', () => {
        const error = new Error('1');
        const prependedError = ensureErrorAndPrependMessage(error, '2');

        assert.strictEquals(prependedError.message, '2: 1');
        assert.strictEquals(
            prependedError.stack,
            error.stack,
            'the error stack should not get modified',
        );
        assert.strictEquals(prependedError, error, 'should not create a new error');
    });
    it('handles readonly message', () => {
        class ReadonlyMessageError extends Error {
            public override get message() {
                return 'message here';
            }
        }

        const originalError = new ReadonlyMessageError();
        const ensuredError = ensureErrorAndPrependMessage(originalError, 'Appended');

        assert.strictEquals(ensuredError.message, 'Appended: message here');
        assert.strictEquals(ensuredError.cause, originalError);
    });
});

describe(ensureErrorClass.name, () => {
    it('converts an error', () => {
        class MyCustomError extends Error {
            public override readonly name = 'MyCustomError';
        }

        assert.throws(
            () => {
                try {
                    throw new TypeError('derp');
                } catch (error) {
                    throw ensureErrorClass(error, MyCustomError, extractErrorMessage(error));
                }
            },
            {
                matchConstructor: MyCustomError,
            },
        );
    });
    it('does not convert an error', () => {
        class MyCustomError extends Error {
            public override readonly name = 'MyCustomError';
        }

        assert.throws(
            () => {
                try {
                    throw new MyCustomError('derp');
                } catch (error) {
                    throw ensureErrorClass(error, MyCustomError, extractErrorMessage(error));
                }
            },
            {
                matchConstructor: MyCustomError,
            },
        );
    });

    it('requires constructor parameters', () => {
        class MyCustomError2 extends Error {
            public override readonly name = 'MyCustomError';

            constructor(param1: string, param2: number) {
                super();
            }
        }

        // @ts-expect-error: missing parameters
        const result = ensureErrorClass({}, MyCustomError2);
        ensureErrorClass({}, MyCustomError2, 'hi', 3);
    });
});
