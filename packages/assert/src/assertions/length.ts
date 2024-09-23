/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    getObjectTypedKeys,
    type AnyObject,
    type AtLeastTuple,
    type MaybePromise,
    type Tuple,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {type WaitUntilOptions} from '../guard-types/wait-until-function.js';

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

// These functions are not used at run time, they're only here for types.
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

const assertions: {
    /**
     * Asserts that an array or string has at least the given length.
     *
     * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isLengthAtLeast(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     2,
     * ); // passes
     * assert.isLengthAtLeast(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     3,
     * ); // passes
     * assert.isLengthAtLeast(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     3,
     * ); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is less than the given length.
     * @see
     * - {@link assert.isLengthExactly} : the more exact assertion.
     */
    isLengthAtLeast: typeof isLengthAtLeast;
    /**
     * Asserts that an array or string has exactly the given length.
     *
     * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isLengthExactly(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     2,
     * ); // fails
     * assert.isLengthExactly(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     3,
     * ); // passes
     * assert.isLengthExactly(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     3,
     * ); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not exactly the given length.
     * @see
     * - {@link assert.isLengthAtLeast} : the more flexible assertion.
     */
    isLengthExactly: typeof isLengthExactly;
} = {
    isLengthAtLeast,
    isLengthExactly,
};

export const lengthGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that an array or string has at least the given length.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `true`
         * check.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `true`
         * check.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isLengthExactly} : the more exact check.
         */
        isLengthAtLeast: autoGuard<typeof checkIsLengthAtLeast>(),
        /**
         * Checks that an array or string has exactly the given length.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // fails
         * check.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // passes
         * check.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // fails
         * ```
         *
         * @see
         * - {@link check.isLengthAtLeast} : the more flexible check.
         */
        isLengthExactly: autoGuard<typeof checkIsLengthExactly>(),
    },
    assertWrap: {
        /**
         * Asserts that an array or string has at least the given length. Returns the value if the
         * assertion passes.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `['a', 'b', 'c']`
         * assertWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * assertWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // throws an error
         * ```
         *
         * @returns The value if it has at least the given length.
         * @throws {@link AssertionError} If the value is less than the given length.
         * @see
         * - {@link assertWrap.isLengthExactly} : the more exact assertion.
         */
        isLengthAtLeast: autoGuard<typeof assertWrapIsLengthAtLeast>(),
        /**
         * Asserts that an array or string has exactly the given length. Returns the value if the
         * assertion passes.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // throws an error
         * assertWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * assertWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // throws an error
         * ```
         *
         * @returns The value if it has exactly the given length.
         * @throws {@link AssertionError} If the value is not exactly the given length.
         * @see
         * - {@link assertWrap.isLengthAtLeast} : the more flexible assertion.
         */
        isLengthExactly: autoGuard<typeof assertWrapIsLengthExactly>(),
    },
    checkWrap: {
        /**
         * Checks that an array or string has at least the given length. Returns the value if the
         * check passes, otherwise `undefined`.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `['a', 'b', 'c']`
         * checkWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * checkWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isLengthExactly} : the more exact check.
         */
        isLengthAtLeast: autoGuard<typeof checkWrapIsLengthAtLeast>(),
        /**
         * Checks that an array or string has exactly the given length. Returns the value if the
         * check passes, otherwise `undefined`.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `undefined`
         * checkWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * checkWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isLengthAtLeast} : the more flexible check.
         */
        isLengthExactly: autoGuard<typeof checkWrapIsLengthExactly>(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an array or string that has at least the
         * given length. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isLengthAtLeast(2, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // returns `['a', 'b', 'c']`
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // returns `['a', 'b', 'c']`
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isLengthExactly} : the more exact assertion.
         */
        isLengthAtLeast: autoGuard<typeof waitUntilIsLengthAtLeast>(),
        /**
         * Repeatedly calls a callback until its output is an array or string that has exactly the
         * given length. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isLengthAtLeast(2, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // throws an error
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // returns `['a', 'b', 'c']`
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isLengthAtLeast} : the more flexible assertion.
         */
        isLengthExactly: autoGuard<typeof waitUntilIsLengthExactly>(),
    },
} satisfies GuardGroup<typeof assertions>;
