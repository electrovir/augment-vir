import {
    ensureError,
    extractErrorMessage,
    MaybePromise,
    PartialWithNullable,
    TypedFunction,
    type AnyFunction,
} from '@augment-vir/core';
import JSON5 from 'json5';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../augments/guard-types/guard-group.js';
import {createWaitUntil, WaitUntilOptions} from '../augments/guard-types/wait-until-function.js';

enum ThrowsCheckType {
    Assert = 'assert',
    AssertWrap = 'assert-wrap',
    CheckWrap = 'check-wrap',
    Check = 'check',
}

function assertError(
    actual: unknown,
    matchOptions?: ErrorMatchOptions | undefined,
    failureMessage?: string | undefined,
): asserts actual is Error {
    internalAssertError(
        actual,
        {
            noError: 'No error.',
            notInstance: `'${JSON5.stringify(actual)}' is not an error instance.`,
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
            notInstance: `Thrown value '${JSON5.stringify(actual)}' is not an error instance.`,
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

/** Matching options for a thrown error constructor or message string. */
export type ErrorMatchOptions = PartialWithNullable<{
    matchMessage: string | RegExp;
    matchConstructor: ErrorConstructor | {new (...args: any[]): Error};
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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

const internalWaitUntilThrows = createWaitUntil(assertError);

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
    isError: typeof assertError;
    throws: typeof throws;
} = {
    throws,
    isError: assertError,
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
