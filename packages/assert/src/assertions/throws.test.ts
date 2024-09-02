import {extractErrorMessage} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {AssertionError} from '../augments/assertion.error.js';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
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
            assert.tsType(assert.throws(actualPass, {}, 'yo')).equals<void>();
            assert.tsType(assert.throws(actualPass, undefined, 'yo')).equals<void>();
            assert
                .tsType(assert.throws(actualPass, {matchConstructor: Error}, 'yo'))
                .equals<void>();
            assert.tsType(assert.throws(actualPass, {matchMessage: ''}, 'yo')).equals<void>();
            assert
                .tsType(
                    assert.throws(actualPass, {matchConstructor: Error, matchMessage: ''}, 'yo'),
                )
                .equals<void>();
        });

        it('is synchronous if callback is synchronous without a message', () => {
            assert.tsType(assert.throws(actualPass)).equals<void>();
            assert.tsType(assert.throws(actualPass, {})).equals<void>();
            assert.tsType(assert.throws(actualPass, undefined)).equals<void>();
            assert.tsType(assert.throws(actualPass, {matchConstructor: Error})).equals<void>();
            assert.tsType(assert.throws(actualPass, {matchMessage: ''})).equals<void>();
            assert
                .tsType(assert.throws(actualPass, {matchConstructor: Error, matchMessage: ''}))
                .equals<void>();
        });

        it('is asynchronous if callback is asynchronous with a message', () => {
            assert.tsType(assert.throws(actualPassAsync, {}, 'yo')).equals<Promise<void>>();
            assert.tsType(assert.throws(actualPassAsync, undefined, 'yo')).equals<Promise<void>>();
            assert
                .tsType(assert.throws(actualPassAsync, {matchConstructor: Error}, 'yo'))
                .equals<Promise<void>>();
            assert
                .tsType(assert.throws(actualPassAsync, {matchMessage: ''}, 'yo'))
                .equals<Promise<void>>();
            assert
                .tsType(
                    assert.throws(
                        actualPassAsync,
                        {matchConstructor: Error, matchMessage: ''},
                        'yo',
                    ),
                )
                .equals<Promise<void>>();
        });

        it('is asynchronous if callback is asynchronous without a message', () => {
            assert.tsType(assert.throws(actualPassAsync)).equals<Promise<void>>();
            assert
                .tsType(assert.throws(actualPassAsync, {matchConstructor: Error}))
                .equals<Promise<void>>();
            assert
                .tsType(assert.throws(actualPassAsync, {matchMessage: ''}))
                .equals<Promise<void>>();
            assert
                .tsType(assert.throws(actualPassAsync, {matchConstructor: Error, matchMessage: ''}))
                .equals<Promise<void>>();
        });

        it('errors if no error is caught', () => {
            let caughtError: unknown = undefined;
            try {
                assert.throws(() => {});
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(extractErrorMessage(caughtError), 'No Error was thrown.');
        });

        it('errors if no error is caught from an async callback', async () => {
            let caughtError: unknown = undefined;
            try {
                await assert.throws(async () => {});
            } catch (error) {
                caughtError = error;
            }

            assert.isDefined(caughtError);
            assert.strictEquals(extractErrorMessage(caughtError), 'No Error was thrown.');
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
                "Error constructor 'Error' did not match expected constructor 'AssertionError'.",
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
                "with a message: Error message\n\n''\n\ndoes not contain\n\n'this is a message'.",
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
                "Error message\n\n''\n\ndoes not match RegExp\n\n'/this is a message/'.",
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
            assert.strictEquals(extractErrorMessage(caughtError), 'No Error was thrown.');
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
            assert.tsType(check.throws(() => {}, {})).equals<boolean>();
            assert.tsType(check.throws(() => {}, undefined)).equals<boolean>();
            assert.tsType(check.throws(() => {}, {matchConstructor: Error})).equals<boolean>();
            assert.tsType(check.throws(() => {}, {matchMessage: ''})).equals<boolean>();
            assert
                .tsType(check.throws(() => {}, {matchConstructor: Error, matchMessage: ''}))
                .equals<boolean>();
        });
        it('is asynchronous if callback is asynchronous', () => {
            assert.tsType(check.throws(async () => {})).equals<Promise<boolean>>();
            assert
                .tsType(check.throws(async () => {}, {matchConstructor: Error}))
                .equals<Promise<boolean>>();
            assert
                .tsType(check.throws(async () => {}, {matchMessage: ''}))
                .equals<Promise<boolean>>();
            assert
                .tsType(check.throws(async () => {}, {matchConstructor: Error, matchMessage: ''}))
                .equals<Promise<boolean>>();
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

            assert.tsType(newValue).equals<Error>();
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
                matchMessage: 'No Error was thrown.',
            });
        });
        it('catches an async callback error', async () => {
            const result = await assertWrap.throws(() => {
                return Promise.reject(new Error('fake error'));
            });
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-throwing async callback error', async () => {
            await assert.throws(
                () =>
                    assertWrap.throws(() => {
                        return Promise.resolve('hi');
                    }),
                {
                    matchMessage: 'No Error was thrown.',
                },
            );
        });
        it('catches a promise rejection', async () => {
            const result = await assertWrap.throws(Promise.reject(new Error('fake error')));
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-rejecting promise', async () => {
            await assert.throws(() => assertWrap.throws(Promise.resolve('hi')), {
                matchMessage: 'No Error was thrown.',
            });
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.throws(actualPass);

            assert.tsType(newValue).equals<Error | undefined>();
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
                return Promise.reject(new Error('fake error'));
            });
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-throwing async callback error', async () => {
            assert.isUndefined(
                await checkWrap.throws(() => {
                    return Promise.resolve('hi');
                }),
            );
        });
        it('catches a promise rejection', async () => {
            const result = await checkWrap.throws(Promise.reject(new Error('fake error')));
            assert.instanceOf(result, Error);
            assert.strictEquals(extractErrorMessage(result), 'fake error');
        });
        it('rejects a non-rejecting promise', async () => {
            assert.isUndefined(await checkWrap.throws(Promise.resolve('hi')));
        });
    });
    describe('waitUntil', () => {
        describe('with callback', () => {
            it('guards with match', async () => {
                const newValue = await waitUntil.throws(
                    {matchConstructor: Error},
                    () => {
                        throw new Error('fake error');
                    },
                    waitUntilTestOptions,
                    'failure',
                );

                assert.tsType(newValue).equals<Error>();

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

                assert.tsType(newValue).equals<Error>();

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
            it('rejects with async callback', async () => {
                await assert.throws(
                    waitUntil.throws(
                        {matchConstructor: AssertionError},
                        async () => {
                            return await Promise.reject(new Error('fake error'));
                        },
                        waitUntilTestOptions,
                        'failure',
                    ),
                );
            });
        });
        describe('with promise', () => {
            it('guards with match', async () => {
                await assert.throws(async () => {
                    await waitUntil.throws(
                        {matchConstructor: Error},
                        // @ts-expect-error: promises are not allowed with `waitUntil`
                        Promise.reject(new Error('fake error')),
                        waitUntilTestOptions,
                        'failure',
                    );
                });
            });
        });
    });
});
describe('isError', () => {
    const actualPass: unknown = new TypeError('hi');
    const actualReject: unknown = 'hi' as any;
    type ExpectedType = TypeError;
    type UnexpectedType = string;

    type ExpectedUnionNarrowedType = TypeError;
    const actualPassUnion: string | ExpectedUnionNarrowedType = new TypeError('hi') as any;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isError(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isError(actualReject));
        });
        it('narrows', () => {
            assert.isError(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isError(actualPass));

            if (check.isError(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isError(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isError(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isError(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isError(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isError(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isError(
                {
                    matchConstructor: TypeError,
                },
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
                waitUntil.isError({}, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
