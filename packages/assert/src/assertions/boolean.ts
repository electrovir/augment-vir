import {MaybePromise, NarrowToExpected, stringify} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */

/**
 * All falsy values in JavaScript. This does not include `NaN` because there is no dedicated type
 * for it in TypeScript.
 *
 * @category Assert : Util
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
export type Falsy<T> = NarrowToExpected<T, FalsyValue>; /**
 * Narrows the given type parameter `T` to all its truthy sub-types.
 *
 * @category Assert : Util
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
     * Check if a value is falsy.
     *
     * Type guards the value when possible.
     */
    isFalsy: typeof isFalsy;
    /**
     * Check if a value is truthy.
     *
     * Type guards the value when possible.
     */
    isTruthy: typeof isTruthy;
    /**
     * Check if a value is `true`.
     *
     * Type guards the value.
     */
    isTrue: typeof isTrue;
    /**
     * Check if a value is `false`.
     *
     * Type guards the value.
     */
    isFalse: typeof isFalse;
} = {
    isFalsy,
    isTruthy,
    isTrue,
    isFalse,
};

export const booleanGuards = {
    assertions,
    checkOverrides: {
        isTruthy: autoGuard<<T>(input: T) => input is Truthy<T>>(),
    },
    assertWrapOverrides: {
        isFalsy: autoGuard<<T>(input: T, failureMessage?: string | undefined) => Falsy<T>>(),
        isTruthy: autoGuard<<T>(input: T, failureMessage?: string | undefined) => Truthy<T>>(),
    },
    checkWrapOverrides: {
        isFalsy: autoGuard<<T>(input: T) => Falsy<T> | undefined>(),
        isTruthy: autoGuard<<T>(input: T) => Truthy<T> | undefined>(),
    },
    waitUntilOverrides: {
        isFalsy:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Falsy<Actual>>
            >(),
        isTruthy:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Truthy<Actual>>
            >(),
    },
} satisfies GuardGroup;
