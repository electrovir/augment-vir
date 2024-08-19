/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    getObjectTypedKeys,
    MaybePromise,
    Tuple,
    type AnyObject,
    type AtLeastTuple,
} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

function isLengthAtLeast<const Element, const Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
    failureMessage?: string | undefined,
): asserts actual is AtLeastTuple<Element, Length>;
function isLengthAtLeast(
    actual: string | AnyObject,
    length: number,
    failureMessage?: string | undefined,
): void;
function isLengthAtLeast(
    actual: ReadonlyArray<any> | string | AnyObject,
    length: number,
    failureMessage?: string | undefined,
): void {
    const actualLength =
        Array.isArray(actual) || typeof actual === 'string'
            ? actual.length
            : getObjectTypedKeys(actual).length;

    if (actualLength < length) {
        throw new AssertionError(
            `Length '${actual.length}' is not at least '${length}'.`,
            failureMessage,
        );
    }
}
function isLengthExactly<const Element, const Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
    failureMessage?: string | undefined,
): asserts actual is Tuple<Element, Length>;
function isLengthExactly(
    actual: string | AnyObject,
    length: number,
    failureMessage?: string | undefined,
): void;
function isLengthExactly(
    actual: ReadonlyArray<any> | string | AnyObject,
    length: number,
    failureMessage?: string | undefined,
): void {
    const actualLength =
        Array.isArray(actual) || typeof actual === 'string'
            ? actual.length
            : getObjectTypedKeys(actual).length;

    if (actualLength !== length) {
        throw new AssertionError(
            `Length '${actual.length}' is not exactly '${length}'.`,
            failureMessage,
        );
    }
}

const assertions: {
    isLengthAtLeast: typeof isLengthAtLeast;
    isLengthExactly: typeof isLengthExactly;
} = {
    isLengthAtLeast,
    isLengthExactly,
};

/** These functions are not used at run time, they're only here for types. */
/* node:coverage disable */

function checkIsLengthAtLeast<Element, Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
): actual is AtLeastTuple<Element, Length>;
function checkIsLengthAtLeast(actual: string | AnyObject, length: number): boolean;
function checkIsLengthAtLeast(
    actual: AnyObject | string | ReadonlyArray<unknown>,
    length: number,
): boolean {
    return false;
}
function assertWrapIsLengthAtLeast<Element, Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
): AtLeastTuple<Element, Length>;
function assertWrapIsLengthAtLeast<Actual extends string | AnyObject>(
    actual: Actual,
    length: number,
): Actual;
function assertWrapIsLengthAtLeast(
    actual: AnyObject | string | ReadonlyArray<unknown>,
    length: number,
): unknown {
    return false;
}
function checkWrapIsLengthAtLeast<Element, Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
): AtLeastTuple<Element, Length> | undefined;
function checkWrapIsLengthAtLeast<Actual extends string | AnyObject>(
    actual: Actual,
    length: number,
): Actual | undefined;
function checkWrapIsLengthAtLeast(
    actual: AnyObject | string | ReadonlyArray<unknown>,
    length: number,
): unknown {
    return false;
}
function waitUntilIsLengthAtLeast<Element, Length extends number>(
    length: Length,
    callback: () => MaybePromise<ReadonlyArray<Element | undefined>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<AtLeastTuple<Element, Length>>;
function waitUntilIsLengthAtLeast<Actual extends string | AnyObject>(
    length: number,
    callback: () => MaybePromise<Actual>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Actual>;
function waitUntilIsLengthAtLeast(
    length: number,
    callback: () => MaybePromise<AnyObject | string | ReadonlyArray<unknown>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): unknown {
    return false;
}

function checkIsLengthExactly<Element, Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
): actual is Tuple<Element, Length>;
function checkIsLengthExactly(actual: string | AnyObject, length: number): boolean;
function checkIsLengthExactly(
    actual: AnyObject | string | ReadonlyArray<unknown>,
    length: number,
): boolean {
    return false;
}
function assertWrapIsLengthExactly<Element, Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
): Tuple<Element, Length>;
function assertWrapIsLengthExactly<Actual extends string | AnyObject>(
    actual: Actual,
    length: number,
): Actual;
function assertWrapIsLengthExactly(
    actual: AnyObject | string | ReadonlyArray<unknown>,
    length: number,
): unknown {
    return false;
}
function checkWrapIsLengthExactly<Element, Length extends number>(
    actual: ReadonlyArray<Element | undefined>,
    length: Length,
): Tuple<Element, Length> | undefined;
function checkWrapIsLengthExactly<Actual extends string | AnyObject>(
    actual: Actual,
    length: number,
): Actual | undefined;
function checkWrapIsLengthExactly(
    actual: AnyObject | string | ReadonlyArray<unknown>,
    length: number,
): unknown {
    return false;
}
function waitUntilIsLengthExactly<Element, Length extends number>(
    length: Length,
    callback: () => MaybePromise<ReadonlyArray<Element | undefined>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Tuple<Element, Length>>;
function waitUntilIsLengthExactly<Actual extends string | AnyObject>(
    length: number,
    callback: () => MaybePromise<Actual>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Actual>;
function waitUntilIsLengthExactly(
    length: number,
    callback: () => MaybePromise<AnyObject | string | ReadonlyArray<unknown>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): unknown {
    return false;
}
/* node:coverage enable */

export const lengthGuards = {
    assertions,
    checkOverrides: {
        isLengthAtLeast: autoGuard<typeof checkIsLengthAtLeast>(),
        isLengthExactly: autoGuard<typeof checkIsLengthExactly>(),
    },
    assertWrapOverrides: {
        isLengthAtLeast: autoGuard<typeof assertWrapIsLengthAtLeast>(),
        isLengthExactly: autoGuard<typeof assertWrapIsLengthExactly>(),
    },
    checkWrapOverrides: {
        isLengthAtLeast: autoGuard<typeof checkWrapIsLengthAtLeast>(),
        isLengthExactly: autoGuard<typeof checkWrapIsLengthExactly>(),
    },
    waitUntilOverrides: {
        isLengthAtLeast: autoGuard<typeof waitUntilIsLengthAtLeast>(),
        isLengthExactly: autoGuard<typeof waitUntilIsLengthExactly>(),
    },
} satisfies GuardGroup;
