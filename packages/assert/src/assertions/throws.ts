import {
    ensureError,
    extractErrorMessage,
    MaybePromise,
    PartialWithNullable,
    stringify,
    TypedFunction,
    type AnyFunction,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {createWaitUntil, WaitUntilOptions} from '../guard-types/wait-until-function.js';

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
 * @package @augment-vir/assert
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
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Error>;
function throwsWaitUntil(
    matchOptions: ErrorMatchOptions,
    callbackOrPromise: TypedFunction<void, any> | Promise<any>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Error>;
function throwsWaitUntil(
    matchOptionsOrCallbackOrPromise: ErrorMatchOptions | TypedFunction<void, any> | Promise<any>,
    callbackOrPromiseOrOptions?: TypedFunction<void, any> | Promise<any> | WaitUntilOptions,
    optionsOrFailureMessage?: WaitUntilOptions | string | undefined,
    failureMessage?: string | undefined,
): Promise<Error> {
    const matchOptions: ErrorMatchOptions | undefined =
        typeof matchOptionsOrCallbackOrPromise === 'function' ||
        matchOptionsOrCallbackOrPromise instanceof Promise
            ? undefined
            : matchOptionsOrCallbackOrPromise;
    const callbackOrPromise = (
        matchOptions ? callbackOrPromiseOrOptions : matchOptionsOrCallbackOrPromise
    ) as TypedFunction<void, any> | Promise<any>;
    const actualFailureMessage =
        typeof optionsOrFailureMessage === 'object' ? failureMessage : optionsOrFailureMessage;
    const waitUntilOptions =
        typeof optionsOrFailureMessage === 'object'
            ? optionsOrFailureMessage
            : (callbackOrPromiseOrOptions as WaitUntilOptions);

    return internalWaitUntilThrows(
        matchOptions,
        async () => {
            try {
                if (typeof callbackOrPromise === 'function') {
                    await callbackOrPromise();
                } else {
                    await callbackOrPromise;
                }
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
     * Checks that the input is an instance of the built-in `Error` class and compares it to the
     * given {@link ErrorMatchOptions}, if provided.
     *
     * Type guards the input.
     */
    isError: typeof isError;
    /**
     * If a function input is provided:
     *
     * Calls that function and checks that the function throw an error, comparing the error with the
     * given {@link ErrorMatchOptions}, if provided.
     *
     * If a promise is provided:
     *
     * Awaits the promise and checks that the promise rejected with an error, comparing the error
     * with the given {@link ErrorMatchOptions}, if provided.
     *
     * This method will automatically type itself as async vs async based on the input. (A promise
     * or async function inputs results in async. Otherwise, sync.)
     *
     * Performs no type guarding.
     */
    throws: typeof throws;
} = {
    throws,
    isError: isError,
};

export const throwGuards = {
    assertions,
    checkOverrides: {
        throws: throwsCheck,
    },
    assertWrapOverrides: {
        throws: throwsAssertWrap,
    },
    checkWrapOverrides: {
        throws: throwsCheckWrap,
    },
    waitUntilOverrides: {
        throws: throwsWaitUntil,
    },
} satisfies GuardGroup;
