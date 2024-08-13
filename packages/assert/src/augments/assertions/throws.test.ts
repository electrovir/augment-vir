import {extractErrorMessage} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {AssertionError} from '../assertion.error.js';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('throws', () => {
    const actualPass = () => {
        throw new Error('fake error');
    };
    const actualPassAsync = async () => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => reject(new Error('fake error')), 0);
        });
    };
    const actualReject = (() => {
        return true;
    }) as any;

    describe('assert', () => {
        it('works', () => {
            assert.throws(actualPass);
        });
        it('rejects', () => {
            assert.throws(() => assert.throws(actualReject));
        });

        it('is synchronous if callback is synchronous with a message', () => {
            assert.typeOf(assert.throws(actualPass, {}, 'yo')).toEqualTypeOf<void>();
            assert.typeOf(assert.throws(actualPass, undefined, 'yo')).toEqualTypeOf<void>();
            assert
                .typeOf(assert.throws(actualPass, {matchConstructor: Error}, 'yo'))
                .toEqualTypeOf<void>();
            assert
                .typeOf(assert.throws(actualPass, {matchMessage: ''}, 'yo'))
                .toEqualTypeOf<void>();
            assert
                .typeOf(
                    assert.throws(actualPass, {matchConstructor: Error, matchMessage: ''}, 'yo'),
                )
                .toEqualTypeOf<void>();
        });

        it('is synchronous if callback is synchronous without a message', () => {
            assert.typeOf(assert.throws(actualPass)).toEqualTypeOf<void>();
            assert.typeOf(assert.throws(actualPass, {})).toEqualTypeOf<void>();
            assert.typeOf(assert.throws(actualPass, undefined)).toEqualTypeOf<void>();
            assert
                .typeOf(assert.throws(actualPass, {matchConstructor: Error}))
                .toEqualTypeOf<void>();
            assert.typeOf(assert.throws(actualPass, {matchMessage: ''})).toEqualTypeOf<void>();
            assert
                .typeOf(assert.throws(actualPass, {matchConstructor: Error, matchMessage: ''}))
                .toEqualTypeOf<void>();
        });

        it('is asynchronous if callback is asynchronous with a message', async () => {
            assert.typeOf(assert.throws(actualPassAsync, {}, 'yo')).toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(assert.throws(actualPassAsync, undefined, 'yo'))
                .toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(assert.throws(actualPassAsync, {matchConstructor: Error}, 'yo'))
                .toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(assert.throws(actualPassAsync, {matchMessage: ''}, 'yo'))
                .toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(
                    assert.throws(
                        actualPassAsync,
                        {matchConstructor: Error, matchMessage: ''},
                        'yo',
                    ),
                )
                .toEqualTypeOf<Promise<void>>();
        });

        it('is asynchronous if callback is asynchronous without a message', () => {
            assert.typeOf(assert.throws(actualPassAsync)).toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(assert.throws(actualPassAsync, {matchConstructor: Error}))
                .toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(assert.throws(actualPassAsync, {matchMessage: ''}))
                .toEqualTypeOf<Promise<void>>();
            assert
                .typeOf(assert.throws(actualPassAsync, {matchConstructor: Error, matchMessage: ''}))
                .toEqualTypeOf<Promise<void>>();
        });

        it('errors if no error is caught', () => {
            let caughtError: unknown = undefined;
            try {
                assert.throws(() => {});
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(extractErrorMessage(caughtError), 'No error was thrown');
        });

        it('errors if no error is caught from an async callback', async () => {
            let caughtError: unknown = undefined;
            try {
                await assert.throws(async () => {});
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(extractErrorMessage(caughtError), 'No error was thrown');
        });

        it('passes if an error is caught', () => {
            assert.throws(() => {
                throw new Error();
            });
        });

        it('passes if an error is caught from an async callback', async () => {
            // eslint-disable-next-line @typescript-eslint/require-await
            await assert.throws(async (): Promise<string> => {
                throw new Error();
            });
        });

        it('passes with matching options', () => {
            assert.throws(
                () => {
                    throw new Error();
                },
                {matchConstructor: Error, matchMessage: ''},
            );
        });

        it('fails with mismatched error class', () => {
            let caughtError: unknown = undefined;
            try {
                assert.throws(
                    () => {
                        throw new Error();
                    },
                    {
                        matchConstructor: AssertionError,
                    },
                );
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(
                extractErrorMessage(caughtError),
                "Error constructor 'Error' did not match expected constructor 'AssertionError'",
            );
        });

        it('fails with mismatched message string', () => {
            let caughtError: unknown = undefined;
            try {
                assert.throws(
                    () => {
                        throw new Error();
                    },
                    {
                        matchMessage: 'this is a message',
                    },
                    'with a message',
                );
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(
                extractErrorMessage(caughtError),
                "Error message\n\n''\n\ndid not contain\n\n'this is a message'\n\nwith a message",
            );
        });

        it('fails with mismatched message regexp', () => {
            let caughtError: unknown = undefined;
            try {
                assert.throws(
                    () => {
                        throw new Error();
                    },
                    {
                        matchMessage: /this is a message/,
                    },
                );
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(
                extractErrorMessage(caughtError),
                "Error message\n\n''\n\ndid not match RegExp\n\n'/this is a message/'",
            );
        });

        it('fails when a promise does not reject', async () => {
            let caughtError: unknown = undefined;
            try {
                await assert.throws(
                    () => {
                        return new Promise<void>((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 0);
                        });
                    },
                    {
                        matchMessage: /this is a message/,
                    },
                );
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(extractErrorMessage(caughtError), 'No error was thrown');
        });

        it('passes a promise that rejects', async () => {
            await assert.throws(Promise.reject(new Error('failure')), {
                matchMessage: 'failure',
            });
        });
    });
    describe('check', () => {
        it('works', () => {
            assert.isTrue(check.throws(actualPass));
        });
        it('rejects', () => {
            assert.isFalse(check.throws(actualReject));
        });
        it('is synchronous if callback is synchronous', () => {
            assert.typeOf(check.throws(() => {}, {})).toEqualTypeOf<boolean>();
            assert.typeOf(check.throws(() => {}, undefined)).toEqualTypeOf<boolean>();
            assert
                .typeOf(check.throws(() => {}, {matchConstructor: Error}))
                .toEqualTypeOf<boolean>();
            assert.typeOf(check.throws(() => {}, {matchMessage: ''})).toEqualTypeOf<boolean>();
            assert
                .typeOf(check.throws(() => {}, {matchConstructor: Error, matchMessage: ''}))
                .toEqualTypeOf<boolean>();
        });
        it('is asynchronous if callback is asynchronous', () => {
            assert.typeOf(check.throws(async () => {})).toEqualTypeOf<Promise<boolean>>();
            assert
                .typeOf(check.throws(async () => {}, {matchConstructor: Error}))
                .toEqualTypeOf<Promise<boolean>>();
            assert
                .typeOf(check.throws(async () => {}, {matchMessage: ''}))
                .toEqualTypeOf<Promise<boolean>>();
            assert
                .typeOf(check.throws(async () => {}, {matchConstructor: Error, matchMessage: ''}))
                .toEqualTypeOf<Promise<boolean>>();
        });

        it('fails if no error is caught', () => {
            assert.isFalse(check.throws(() => {}));
        });

        it('fails if no error is caught from an async callback', async () => {
            assert.isFalse(await check.throws(async () => {}));
        });

        it('passes if an error is caught', () => {
            check.throws(() => {
                throw new Error();
            });
        });

        it('passes if an error is caught from an async callback', async () => {
            // eslint-disable-next-line @typescript-eslint/require-await
            await check.throws(async (): Promise<string> => {
                throw new Error();
            });
        });

        it('passes with matching options', () => {
            check.throws(
                () => {
                    throw new Error();
                },
                {matchConstructor: Error, matchMessage: ''},
            );
        });

        it('fails with mismatched error class', () => {
            assert.isFalse(
                check.throws(
                    () => {
                        throw new Error();
                    },
                    {
                        matchConstructor: AssertionError,
                    },
                ),
            );
        });

        it('fails with mismatched message string', () => {
            assert.isFalse(
                check.throws(
                    () => {
                        throw new Error();
                    },
                    {
                        matchMessage: 'this is a message',
                    },
                ),
            );
        });

        it('fails with mismatched message regexp', () => {
            assert.isFalse(
                check.throws(
                    () => {
                        throw new Error();
                    },
                    {
                        matchMessage: /this is a message/,
                    },
                ),
            );
        });

        it('fails when a promise does not reject', async () => {
            assert.isFalse(
                await check.throws(
                    () => {
                        return new Promise<void>((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 0);
                        });
                    },
                    {
                        matchMessage: /this is a message/,
                    },
                ),
            );
        });

        it('passes a promise that rejects', async () => {
            await check.throws(Promise.reject(new Error('failure')), {
                matchMessage: 'failure',
            });
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.throws(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<Error>();
            assert.instanceOf(newValue, Error);
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.throws(actualReject));
        });
        it('catches a sync callback error', () => {
            const result = assertWrap.throws(() => {
                throw new Error('fake error');
            });
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-throwing sync callback error', () => {
            assert.throws(() => assertWrap.throws(() => {}), {
                matchMessage: 'No error was thrown',
            });
        });
        it('catches an async callback error', async () => {
            const result = await assertWrap.throws(() => {
                return new Promise((resolve, reject) => {
                    reject(new Error('fake error'));
                });
            });
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-throwing async callback error', async () => {
            await assert.throws(
                () =>
                    assertWrap.throws(() => {
                        return new Promise((resolve, reject) => {
                            resolve('hi');
                        });
                    }),
                {
                    matchMessage: 'No error was thrown',
                },
            );
        });
        it('catches a promise rejection', async () => {
            const result = await assertWrap.throws(
                new Promise((resolve, reject) => {
                    reject(new Error('fake error'));
                }),
            );
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-rejecting promise', async () => {
            await assert.throws(
                () =>
                    assertWrap.throws(
                        new Promise((resolve, reject) => {
                            resolve('hi');
                        }),
                    ),
                {
                    matchMessage: 'No error was thrown',
                },
            );
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.throws(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<Error | undefined>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.throws(actualReject));
        });
        it('catches a sync callback error', () => {
            const result = checkWrap.throws(() => {
                throw new Error('fake error');
            });
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-throwing sync callback error', () => {
            assert.isUndefined(checkWrap.throws(() => {}));
        });
        it('catches an async callback error', async () => {
            const result = await checkWrap.throws(() => {
                return new Promise((resolve, reject) => {
                    reject(new Error('fake error'));
                });
            });
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-throwing async callback error', async () => {
            assert.isUndefined(
                await checkWrap.throws(() => {
                    return new Promise((resolve, reject) => {
                        resolve('hi');
                    });
                }),
            );
        });
        it('catches a promise rejection', async () => {
            const result = await checkWrap.throws(
                new Promise((resolve, reject) => {
                    reject(new Error('fake error'));
                }),
            );
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-rejecting promise', async () => {
            assert.isUndefined(
                await checkWrap.throws(
                    new Promise((resolve, reject) => {
                        resolve('hi');
                    }),
                ),
            );
        });
    });
    describe('waitUntil', () => {
        describe('with callback', () => {
            it.only('guards with match', async () => {
                const newValue = await waitUntil.throws(
                    {matchConstructor: Error},
                    () => {
                        throw new Error('fake error');
                    },
                    waitUntilTestOptions,
                    'failure',
                );

                assert.typeOf(newValue).toEqualTypeOf<Error>();

                assert.strictEquals(extractErrorMessage(newValue), 'fake error');
            });
            it('guards without match', async () => {
                const newValue = await waitUntil.throws(
                    () => {
                        throw new Error('fake error');
                    },
                    waitUntilTestOptions,
                    'failure',
                );

                assert.typeOf(newValue).toEqualTypeOf<Error>();

                assert.strictEquals(extractErrorMessage(newValue), 'fake error');
            });
            it('rejects', async () => {
                await assert.throws(
                    waitUntil.throws(actualReject, waitUntilTestOptions, 'failure'),
                );
            });
            it('rejects with match', async () => {
                await assert.throws(
                    waitUntil.throws(
                        {matchConstructor: AssertionError},
                        () => {
                            throw new Error('fake error');
                        },
                        waitUntilTestOptions,
                        'failure',
                    ),
                );
            });
        });
        describe('with promise', () => {
            it('guards with match', async () => {
                const newValue = await waitUntil.throws(
                    {matchConstructor: Error},
                    Promise.reject(new Error('fake error')),
                    waitUntilTestOptions,
                    'failure',
                );

                assert.typeOf(newValue).toEqualTypeOf<Error>();

                assert.strictEquals(extractErrorMessage(newValue), 'fake error');
            });
            it('guards without match', async () => {
                const newValue = await waitUntil.throws(
                    Promise.reject(new Error('fake error')),
                    waitUntilTestOptions,
                    'failure',
                );

                assert.typeOf(newValue).toEqualTypeOf<Error>();

                assert.strictEquals(extractErrorMessage(newValue), 'fake error');
            });
            it('rejects', async () => {
                await assert.throws(
                    waitUntil.throws(Promise.resolve('hi'), waitUntilTestOptions, 'failure'),
                );
            });
            it('rejects with match', async () => {
                await assert.throws(
                    waitUntil.throws(
                        {matchConstructor: AssertionError},
                        Promise.reject(new Error('fake error')),
                        waitUntilTestOptions,
                        'failure',
                    ),
                );
            });
        });
    });
});
