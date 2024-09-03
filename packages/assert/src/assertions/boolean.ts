import {MaybePromise, NarrowToExpected, stringify} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */

/**
 * All falsy values in JavaScript. This does not include `NaN` because there is no dedicated type
 * for it in TypeScript.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import type {FalsyValue} from '@augment-vir/assert';
 *
 * const falsy: FalsyValue = 0;
 * ```
 *
 * @package @augment-vir/assert
 */
export type FalsyValue = undefined | null | false | 0 | '' | -0 | 0n;
/**
 * Narrows the given type parameter `T` to all its falsy sub-types.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import type {Falsy} from '@augment-vir/assert';
 *
 * type MyFalsy = Falsy<string | number>; // "" | 0
 * ```
 *
 * @param T The original type to narrow.
 * @package @augment-vir/assert
 */
export type Falsy<T> = NarrowToExpected<T, FalsyValue>;

/**
 * Narrows the given type parameter `T` to all its truthy sub-types.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import type {Truthy} from '@augment-vir/assert';
 *
 * type MyTruthy = Truthy<0 | undefined | string>; // string
 * ```
 *
 * @param T The original type to narrow.
 * @package @augment-vir/assert
 */
export type Truthy<T> = Exclude<T, FalsyValue>;

function isFalsy(input: unknown, failureMessage?: string | undefined): asserts input is FalsyValue {
    if (input) {
        throw new AssertionError(`'${stringify(input)}' is not truthy.`, failureMessage);
    }
}

function isTruthy<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is Truthy<Actual> {
    if (!input) {
        throw new AssertionError(`'${stringify(input)}' is not truthy.`, failureMessage);
    }
}

function isTrue(input: unknown, failureMessage?: string | undefined): asserts input is true {
    if (input !== true) {
        throw new AssertionError(`'${stringify(input)}' is not true.`, failureMessage);
    }
}

function isFalse(input: unknown, failureMessage?: string | undefined): asserts input is false {
    if (input !== false) {
        throw new AssertionError(`'${stringify(input)}' is not false.`, failureMessage);
    }
}

const assertions: {
    /**
     * Asserts that a value is exactly `false`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isFalse(true); // fails
     * assert.isFalse(false); // passes
     * assert.isFalse(1); // fails
     * assert.isFalse(0); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not `false`.
     * @see
     * - {@link assert.isTrue} : the opposite assertion.
     * - {@link assert.isFalsy} : a less exact assertion.
     */
    isFalse: typeof isFalse;
    /**
     * Asserts that a value is falsy.
     *
     * Type guards the value when possible.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isFalsy(true); // fails
     * assert.isFalsy(false); // passes
     * assert.isFalsy(1); // fails
     * assert.isFalsy(0); // passes
     * ```
     *
     * @throws {@link AssertionError} If the value is not falsy.
     * @see
     * - {@link assert.isTruthy} : the opposite assertion.
     * - {@link assert.isFalse} : a more exact assertion.
     */
    isFalsy: typeof isFalsy;
    /**
     * Asserts that a value is exactly `true`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isTrue(true); // passes
     * assert.isTrue(false); // fails
     * assert.isTrue(1); // fails
     * assert.isTrue(0); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not `true`.
     * @see
     * - {@link assert.isFalse} : the opposite assertion.
     * - {@link assert.isTruthy} : a less exact assertion.
     */
    isTrue: typeof isTrue;
    /**
     * Asserts that a value is truthy.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isTruthy(true); // passes
     * assert.isTruthy(false); // fails
     * assert.isTruthy(1); // passes
     * assert.isTruthy(0); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not truthy.
     * @see
     * - {@link assert.isFalsy} : the opposite assertion.
     * - {@link assert.isTrue} : a more exact assertion.
     */
    isTruthy: typeof isTruthy;
} = {
    isFalse,
    isFalsy,
    isTrue,
    isTruthy,
};

export const booleanGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is exactly `false`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isFalse(true); // returns `false`
         * check.isFalse(false); // returns `true`
         * check.isFalse(1); // returns `false`
         * check.isFalse(0); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isTrue} : the opposite check.
         * - {@link check.isFalsy} : a less exact check.
         */
        isFalse: autoGuardSymbol,
        /**
         * Checks that a value is falsy.
         *
         * Type guards the value when possible.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isFalsy(true); // returns `false`
         * check.isFalsy(false); // returns `true`
         * check.isFalsy(1); // returns `false`
         * check.isFalsy(0); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isTruthy} : the opposite check.
         * - {@link check.isFalse} : a more exact check.
         */
        isFalsy: autoGuardSymbol,
        /**
         * Checks that a value is exactly `true`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isTrue(true); // returns `true`
         * check.isTrue(false); // returns `false`
         * check.isTrue(1); // returns `false`
         * check.isTrue(0); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isFalse} : the opposite check.
         * - {@link check.isTruthy} : a less exact check.
         */
        isTrue: autoGuardSymbol,
        /**
         * Checks that a value is truthy.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isTruthy(true); // passes
         * check.isTruthy(false); // fails
         * check.isTruthy(1); // passes
         * check.isTruthy(0); // fails
         * ```
         *
         * @see
         * - {@link check.isFalsy} : the opposite check.
         * - {@link check.isTrue} : a more exact check.
         */
        isTruthy: autoGuard<<T>(input: T) => input is Truthy<T>>(),
    },
    assertWrap: {
        /**
         * Asserts that a value is exactly `false`. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isFalse(true); // throws an error
         * assertWrap.isFalse(false); // returns `false`
         * assertWrap.isFalse(1); // throws an error
         * assertWrap.isFalse(0); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the value is not `false`.
         * @see
         * - {@link assertWrap.isTrue} : the opposite assertion.
         * - {@link assertWrap.isFalsy} : a less exact assertion.
         */
        isFalse: autoGuardSymbol,
        /**
         * Asserts that a value is falsy. Returns the value if the assertion passes.
         *
         * Type guards the value when possible.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isFalsy(true); // throws an error
         * assertWrap.isFalsy(false); // returns `false`
         * assertWrap.isFalsy(1); // throws an error
         * assertWrap.isFalsy(0); // returns `0`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the value is not falsy.
         * @see
         * - {@link assertWrap.isTruthy} : the opposite assertion.
         * - {@link assertWrap.isFalse} : a more exact assertion.
         */
        isFalsy: autoGuard<<T>(input: T, failureMessage?: string | undefined) => Falsy<T>>(),
        /**
         * Asserts that a value is exactly `true`. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isTrue(true); // returns `true`
         * assertWrap.isTrue(false); // throws an error
         * assertWrap.isTrue(1); // throws an error
         * assertWrap.isTrue(0); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the value is not `true`.
         * @see
         * - {@link assertWrap.isFalse} : the opposite assertion.
         * - {@link assertWrap.isTruthy} : a less exact assertion.
         */
        isTrue: autoGuardSymbol,
        /**
         * Asserts that a value is truthy. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isTruthy(true); // returns `true`
         * assertWrap.isTruthy(false); // throws an error
         * assertWrap.isTruthy(1); // returns `1`
         * assertWrap.isTruthy(0); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the value is not truthy.
         * @see
         * - {@link assertWrap.isFalsy} : the opposite assertion.
         * - {@link assertWrap.isTrue} : a more exact assertion.
         */
        isTruthy: autoGuard<<T>(input: T, failureMessage?: string | undefined) => Truthy<T>>(),
    },
    checkWrap: {
        /**
         * Checks that a value is exactly `false`. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isFalse(true); // returns `false`
         * checkWrap.isFalse(false); // returns `true`
         * checkWrap.isFalse(1); // returns `false`
         * checkWrap.isFalse(0); // returns `false`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isTrue} : the opposite check.
         * - {@link checkWrap.isFalsy} : a less exact check.
         */
        isFalse: autoGuardSymbol,
        /**
         * Checks that a value is falsy. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value when possible.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isFalsy(true); // returns `false`
         * checkWrap.isFalsy(false); // returns `true`
         * checkWrap.isFalsy(1); // returns `false`
         * checkWrap.isFalsy(0); // returns `true`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isTruthy} : the opposite check.
         * - {@link checkWrap.isFalse} : a more exact check.
         */
        isFalsy: autoGuard<<T>(input: T) => Falsy<T> | undefined>(),
        /**
         * Checks that a value is exactly `true`. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isTrue(true); // returns `true`
         * checkWrap.isTrue(false); // returns `false`
         * checkWrap.isTrue(1); // returns `false`
         * checkWrap.isTrue(0); // returns `false`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isFalse} : the opposite check.
         * - {@link checkWrap.isTruthy} : a less exact check.
         */
        isTrue: autoGuardSymbol,
        /**
         * Checks that a value is truthy. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isTruthy(true); // passes
         * checkWrap.isTruthy(false); // fails
         * checkWrap.isTruthy(1); // passes
         * checkWrap.isTruthy(0); // fails
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isFalsy} : the opposite check.
         * - {@link checkWrap.isTrue} : a more exact check.
         */
        isTruthy: autoGuard<<T>(input: T) => Truthy<T> | undefined>(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is exactly `false`. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isFalse(() => true); // throws an error
         * await waitUntil.isFalse(() => false); // returns `false`
         * await waitUntil.isFalse(() => 1); // throws an error
         * await waitUntil.isFalse(() => 0); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isTrue} : the opposite assertion.
         * - {@link waitUntil.isFalsy} : a less exact assertion.
         */
        isFalse: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is falsy. Once the callback output passes,
         * it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isFalsy(() => true); // throws an error
         * await waitUntil.isFalsy(() => false); // returns `false`
         * await waitUntil.isFalsy(() => 1); // throws an error
         * await waitUntil.isFalsy(() => 0); // returns `0`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isTruthy} : the opposite assertion.
         * - {@link waitUntil.isFalse} : a more exact assertion.
         */
        isFalsy:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Falsy<Actual>>
            >(),
        /**
         * Repeatedly calls a callback until its output is exactly `true`. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isTrue(() => true); // returns `true`
         * await waitUntil.isTrue(() => false); // throws an error
         * await waitUntil.isTrue(() => 1); // throws an error
         * await waitUntil.isTrue(() => 0); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isFalse} : the opposite assertion.
         * - {@link waitUntil.isTruthy} : a less exact assertion.
         */
        isTrue: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is truthy. Once the callback output passes,
         * it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isTruthy(() => true); // returns `true`
         * await waitUntil.isTruthy(() => false); // throws an error
         * await waitUntil.isTruthy(() => 1); // returns `1`
         * await waitUntil.isTruthy(() => 0); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isFalsy} : the opposite assertion.
         * - {@link waitUntil.isTrue} : a more exact assertion.
         */
        isTruthy:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Truthy<Actual>>
            >(),
    },
} satisfies GuardGroup<typeof assertions>;
