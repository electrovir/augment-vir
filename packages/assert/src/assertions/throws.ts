import {
    type AnyFunction,
    ensureError,
    extractErrorMessage,
    type MaybePromise,
    type PartialWithNullable,
    stringify,
    type TypedFunction,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuardSymbol} from '../guard-types/guard-override.js';
import {createWaitUntil, type WaitUntilOptions} from '../guard-types/wait-until-function.js';

enum ThrowsCheckType {
    Assert = 'assert',
    AssertWrap = 'assert-wrap',
    CheckWrap = 'check-wrap',
    Check = 'check',
}

function isError(
    actual: unknown,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): asserts actual is Error {
    internalAssertError(
        actual,
        {
            noError: 'No error.',
            notInstance: `'${stringify(actual)}' is not an error instance.`,
        },
        matchOptions,
        failureMessage,
    );
}

function assertThrownError(
    actual: unknown,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): asserts actual is Error {
    internalAssertError(
        actual,
        {
            noError: 'No Error was thrown.',
            notInstance: `Thrown value '${stringify(actual)}' is not an error instance.`,
        },
        matchOptions,
        failureMessage,
    );
}

function internalAssertError(
    actual: unknown,
    errorMessages: {
        noError: string;
        notInstance: string;
    },
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): asserts actual is Error {
    if (!actual) {
        throw new AssertionError(errorMessages.noError, failureMessage);
    } else if (!(actual instanceof Error)) {
        throw new AssertionError(errorMessages.notInstance, failureMessage);
    } else if (
        matchOptions?.matchConstructor &&
        !((actual as any) instanceof matchOptions.matchConstructor)
    ) {
        const constructorName = actual.constructor.name;

        throw new AssertionError(
            `Error constructor '${constructorName}' did not match expected constructor '${matchOptions.matchConstructor.name}'.`,
            failureMessage,
        );
    } else if (matchOptions?.matchMessage) {
        const message = extractErrorMessage(actual);

        if (typeof matchOptions.matchMessage === 'string') {
            if (!message.includes(matchOptions.matchMessage)) {
                throw new AssertionError(
                    `Error message\n\n'${message}'\n\ndoes not contain\n\n'${matchOptions.matchMessage}'.`,
                    failureMessage,
                );
            }
        } else if (!message.match(matchOptions.matchMessage)) {
            throw new AssertionError(
                `Error message\n\n'${message}'\n\ndoes not match RegExp\n\n'${matchOptions.matchMessage}'.`,
                failureMessage,
            );
        }
    }
}

function internalThrowsCheck(
    checkType: ThrowsCheckType,
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
) {
    let caughtError: Error | undefined = undefined;

    try {
        const result =
            callbackOrPromise instanceof Promise ? callbackOrPromise : callbackOrPromise();

        if (result instanceof Promise) {
            return new Promise<any>(async (resolve, reject) => {
                try {
                    await result;
                } catch (error) {
                    caughtError = ensureError(error);
                }

                try {
                    assertThrownError(caughtError, matchOptions, failureMessage);
                    if (checkType === ThrowsCheckType.Assert) {
                        (resolve as AnyFunction)();
                    } else if (checkType === ThrowsCheckType.Check) {
                        resolve(true);
                    } else {
                        resolve(caughtError);
                    }
                } catch (error) {
                    if (checkType === ThrowsCheckType.CheckWrap) {
                        resolve(undefined);
                    } else if (checkType === ThrowsCheckType.Check) {
                        resolve(false);
                    } else {
                        reject(ensureError(error));
                    }
                }
            });
        }
    } catch (error) {
        caughtError = ensureError(error);
    }

    try {
        assertThrownError(caughtError, matchOptions, failureMessage);
        if (checkType === ThrowsCheckType.Check) {
            return true;
        } else if (checkType !== ThrowsCheckType.Assert) {
            return caughtError;
        }
        return;
    } catch (error) {
        if (checkType === ThrowsCheckType.CheckWrap) {
            return undefined;
        } else if (checkType === ThrowsCheckType.Check) {
            return false;
        } else {
            throw error;
        }
    }
}

/**
 * A type that represents possible error matching patterns. This is used by the `.throws` and
 * `isError`, guards in `@augment-vir/assert` as well as `itCases` in `@augment-vir/test`. Each
 * property is optional, and whichever properties are provided will be checked.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import {assert, type ErrorMatchOptions} from '@augment-vir/assert';
 *
 * // define the options
 * const matchOptions: ErrorMatchOptions = {
 *     matchConstructor: Error,
 *     matchMessage: 'some error',
 * };
 *
 * assert.throws(
 *     () => {
 *         throw new Error('some error');
 *     },
 *     // use the options
 *     matchOptions,
 * ); // this assertion will pass
 * ```
 *
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type ErrorMatchOptions = PartialWithNullable<{
    /**
     * A string or RegExp that an error's message will be compared with.
     *
     * - If this is a string, the error's message will checked for _containing_ the given string (not
     *   strictly equalling it): `error.message.includes(options.matchMessage)`
     * - If this is a RegExp, the error's message will be tested against it:
     *   `error.message.match(options.matchMessage)`
     *
     * If this property is omitted, the error message won't be checked at all.
     */
    matchMessage: string | RegExp;
    /**
     * A constructor that the error will be compared to with `instanceof`: `error instanceof
     * options.matchConstructor`. If this property is omitted, the error's constructor or
     * inheritance will not be checked.
     */
    matchConstructor: ErrorConstructor | (new (...args: any[]) => Error);
}>;

function throws(
    callbackOrPromise: TypedFunction<void, never>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): void;
function throws(
    callbackOrPromise: TypedFunction<void, Promise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Promise<void>;
function throws(
    callback: TypedFunction<void, any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): void;
function throws(
    callback: TypedFunction<void, MaybePromise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): MaybePromise<void>;
function throws(
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): MaybePromise<void> {
    return internalThrowsCheck(
        ThrowsCheckType.Assert,
        callbackOrPromise,
        matchOptions,
        failureMessage,
    ) as MaybePromise<void>;
}

function throwsCheck(
    callbackOrPromise: TypedFunction<void, never>,
    matchOptions?: ErrorMatchOptions | undefined,
): boolean;
function throwsCheck(
    callbackOrPromise: TypedFunction<void, Promise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
): Promise<boolean>;
function throwsCheck(
    callback: TypedFunction<void, any>,
    matchOptions?: ErrorMatchOptions | undefined,
): boolean;
function throwsCheck(
    callback: TypedFunction<void, MaybePromise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
): MaybePromise<boolean>;
function throwsCheck(
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
): MaybePromise<boolean> {
    return internalThrowsCheck(
        ThrowsCheckType.Check,
        callbackOrPromise,
        matchOptions,
    ) as MaybePromise<boolean>;
}

function throwsAssertWrap(
    callbackOrPromise: TypedFunction<void, never>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Error;
function throwsAssertWrap(
    callbackOrPromise: TypedFunction<void, Promise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Error>;
function throwsAssertWrap(
    callback: TypedFunction<void, any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Error;
function throwsAssertWrap(
    callback: TypedFunction<void, MaybePromise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): MaybePromise<Error>;
function throwsAssertWrap(
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): MaybePromise<Error> {
    return internalThrowsCheck(
        ThrowsCheckType.AssertWrap,
        callbackOrPromise,
        matchOptions,
        failureMessage,
    ) as MaybePromise<Error>;
}

function throwsCheckWrap(
    callbackOrPromise: TypedFunction<void, never>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Error | undefined;
function throwsCheckWrap(
    callbackOrPromise: TypedFunction<void, Promise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Error | undefined>;
function throwsCheckWrap(
    callback: TypedFunction<void, any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): Error | undefined;
function throwsCheckWrap(
    callback: TypedFunction<void, MaybePromise<any>> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): MaybePromise<Error | undefined>;
function throwsCheckWrap(
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): MaybePromise<Error | undefined> {
    return internalThrowsCheck(
        ThrowsCheckType.CheckWrap,
        callbackOrPromise,
        matchOptions,
        failureMessage,
    ) as MaybePromise<Error | undefined>;
}

const internalWaitUntilThrows = createWaitUntil(isError);

function throwsWaitUntil(
    callback: TypedFunction<void, any>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Error>;
function throwsWaitUntil(
    matchOptions: ErrorMatchOptions,
    callback: TypedFunction<void, any>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Error>;
function throwsWaitUntil(
    matchOptionsOrCallback: ErrorMatchOptions | TypedFunction<void, any>,
    callbackOrOptions?: TypedFunction<void, any> | WaitUntilOptions,
    optionsOrFailureMessage?: WaitUntilOptions | string | undefined,
    failureMessage?: string | undefined,
): Promise<Error> {
    const matchOptions: ErrorMatchOptions | undefined =
        typeof matchOptionsOrCallback === 'function' || matchOptionsOrCallback instanceof Promise
            ? undefined
            : matchOptionsOrCallback;
    const callback = (matchOptions ? callbackOrOptions : matchOptionsOrCallback) as TypedFunction<
        void,
        any
    >;
    const actualFailureMessage =
        typeof optionsOrFailureMessage === 'object' ? failureMessage : optionsOrFailureMessage;
    const waitUntilOptions =
        typeof optionsOrFailureMessage === 'object'
            ? optionsOrFailureMessage
            : (callbackOrOptions as WaitUntilOptions);

    if (typeof callback !== 'function') {
        throw new TypeError(`Callback is not a function, got '${stringify(callback)}'`);
    }

    return internalWaitUntilThrows(
        matchOptions,
        async () => {
            try {
                await callback();
                return undefined;
            } catch (error) {
                return ensureError(error);
            }
        },
        waitUntilOptions,
        actualFailureMessage,
    );
}

const assertions: {
    /**
     * If a function input is provided:
     *
     * Calls that function and asserts that the function throw an error, comparing the error with
     * the given {@link ErrorMatchOptions}, if provided.
     *
     * If a promise is provided:
     *
     * Awaits the promise and asserts that the promise rejected with an error, comparing the error
     * with the given {@link ErrorMatchOptions}, if provided.
     *
     * This assertion will automatically type itself as async vs async based on the input. (A
     * promise or async function inputs results in async. Otherwise, sync.)
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.throws(() => {
     *     throw new Error();
     * }); // passes
     * assert.throws(
     *     () => {
     *         throw new Error();
     *     },
     *     {matchMessage: 'hi'},
     * ); // fails
     * await assert.throws(Promise.reject()); // passes
     * assert.throws(() => {}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     */
    throws: typeof throws;
    /**
     * Asserts that a value is an instance of the built-in `Error` class and compares it to the
     * given {@link ErrorMatchOptions}, if provided.
     *
     * Type guards the input.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isError(new Error()); // passes
     * assert.isError(new Error(), {matchMessage: 'hi'}); // fails
     * assert.isError({message: 'not an error'}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     */
    isError: typeof isError;
} = {
    throws,
    isError: isError,
};

export const throwGuards = {
    assert: assertions,
    check: {
        /**
         * If a function input is provided:
         *
         * Calls that function and checks that the function throw an error, comparing the error with
         * the given {@link ErrorMatchOptions}, if provided.
         *
         * If a promise is provided:
         *
         * Awaits the promise and checks that the promise rejected with an error, comparing the
         * error with the given {@link ErrorMatchOptions}, if provided.
         *
         * This assertion will automatically type itself as async vs async based on the input. (A
         * promise or async function inputs results in async. Otherwise, sync.)
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.throws(() => {
         *     throw new Error();
         * }); // returns `true`
         * check.throws(
         *     () => {
         *         throw new Error();
         *     },
         *     {matchMessage: 'hi'},
         * ); // returns `false`
         * await check.throws(Promise.reject()); // returns `true`
         * check.throws(() => {}); // returns `false`
         * ```
         */
        throws: throwsCheck,
        /**
         * Checks that a value is an instance of the built-in `Error` class and compares it to the
         * given {@link ErrorMatchOptions}, if provided.
         *
         * Type guards the input.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isError(new Error()); // returns `true`
         * check.isError(new Error(), {matchMessage: 'hi'}); // returns `false`
         * check.isError({message: 'not an error'}); // returns `false`
         * ```
         */
        isError: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * If a function input is provided:
         *
         * Calls that function and asserts that the function throw an error, comparing the error
         * with the given {@link ErrorMatchOptions}, if provided. Returns the Error if the assertion
         * passes.
         *
         * If a promise is provided:
         *
         * Awaits the promise and asserts that the promise rejected with an error, comparing the
         * error with the given {@link ErrorMatchOptions}, if provided. Returns the Error if the
         * assertion passes.
         *
         * This assertion will automatically type itself as async vs async based on the input. (A
         * promise or async function inputs results in async. Otherwise, sync.)
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.throws(() => {
         *     throw new Error();
         * }); // returns the thrown error
         * assertWrap.throws(
         *     () => {
         *         throw new Error();
         *     },
         *     {matchMessage: 'hi'},
         * ); // throws an error
         * await assertWrap.throws(Promise.reject()); // returns the rejection
         * assertWrap.throws(() => {}); // throws an error
         * ```
         *
         * @returns The Error if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         */
        throws: throwsAssertWrap,
        /**
         * Asserts that a value is an instance of the built-in `Error` class and compares it to the
         * given {@link ErrorMatchOptions}, if provided.
         *
         * Type guards the input.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isError(new Error()); // returns the error instance
         * assertWrap.isError(new Error(), {matchMessage: 'hi'}); // throws an error
         * assertWrap.isError({message: 'not an error'}); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         */
        isError: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * If a function input is provided:
         *
         * Calls that function and checks that the function throw an error, comparing the error with
         * the given {@link ErrorMatchOptions}, if provided. Returns the error if the check passes,
         * otherwise `undefined`.
         *
         * If a promise is provided:
         *
         * Awaits the promise and checks that the promise rejected with an error, comparing the
         * error with the given {@link ErrorMatchOptions}, if provided. Returns the error if the
         * check passes, otherwise `undefined`.
         *
         * This assertion will automatically type itself as async vs async based on the input. (A
         * promise or async function inputs results in async. Otherwise, sync.)
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.throws(() => {
         *     throw new Error();
         * }); // returns the thrown error
         * await checkWrap.throws(Promise.reject()); // returns the rejection
         * checkWrap.throws(() => {}); // returns `undefined`
         * ```
         *
         * @returns The Error if the check passes, otherwise `undefined`.
         */
        throws: throwsCheckWrap,
        /**
         * Checks that a value is an instance of the built-in `Error` class and compares it to the
         * given {@link ErrorMatchOptions}, if provided. Returns the error if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the input.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isError(new Error()); // returns the Error
         * checkWrap.isError(new Error(), {matchMessage: 'hi'}); // returns `undefined`
         * checkWrap.isError({message: 'not an error'}); // returns `undefined`
         * ```
         *
         * @returns The Error if the check passes, otherwise `undefined`.
         */
        isError: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until it throws an error, comparing the error with the given
         * {@link ErrorMatchOptions}, if provided (as the first input). Once the callback throws an
         * Error, that Error is returned. If the attempts time out, an error is thrown.
         *
         * This assertion will automatically type itself as async vs async based on the input. (A
         * promise or async function inputs results in async. Otherwise, sync.)
         *
         * Unlike the other `.throws` guards, `waitUntil.throws` does not allow a Promise input,
         * only a callback input.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.throws(() => {
         *     throw new Error();
         * }); // returns the thrown error
         * await waitUntil.throws(Promise.reject()); // not allowed
         * await waitUntil.throws(() => {}); // throws an error
         * await waitUntil.throws({matchMessage: 'hi'}, () => {
         *     throw new Error('bye');
         * }); // throws an error
         * ```
         *
         * @returns The Error once it passes.
         * @throws {@link AssertionError} On timeout.
         */
        throws: throwsWaitUntil,
        /**
         * Repeatedly calls a callback until is output is an instance of the built-in `Error` class
         * and compares it to the given {@link ErrorMatchOptions}, if provided. Once the callback
         * output passes, that Error is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the input.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isError(new Error()); // returns the error instance
         * await waitUntil.isError(new Error(), {matchMessage: 'hi'}); // throws an error
         * await waitUntil.isError({message: 'not an error'}); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         */
        isError: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
