import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuardSymbol} from '../guard-types/guard-override.js';

function isAbove(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual <= expected) {
        throw new AssertionError(`${actual} is not above ${expected}`, failureMessage);
    }
}

function isAtLeast(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual < expected) {
        throw new AssertionError(`${actual} is not at least ${expected}`, failureMessage);
    }
}

function isBelow(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual >= expected) {
        throw new AssertionError(`${actual} is not below ${expected}`, failureMessage);
    }
}

function isAtMost(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual > expected) {
        throw new AssertionError(`${actual} is not at most ${expected}`, failureMessage);
    }
}

function isNaNGuard(actual: number, failureMessage?: string | undefined) {
    if (!isNaN(actual)) {
        throw new AssertionError(`${actual} is not NaN`, failureMessage);
    }
}

function isFiniteGuard(actual: number, failureMessage?: string | undefined) {
    if (isNaN(actual) || actual === Infinity || actual === -Infinity) {
        throw new AssertionError(`${actual} is not finite`, failureMessage);
    }
}

function isInfinite(actual: number, failureMessage?: string | undefined) {
    if (actual !== Infinity && actual !== -Infinity) {
        throw new AssertionError(`${actual} is not infinite`, failureMessage);
    }
}

function isApproximately(
    actual: number,
    expected: number,
    delta: number,
    failureMessage?: string | undefined,
) {
    if (actual < expected - delta || actual > expected + delta) {
        throw new AssertionError(
            `${actual} is not within ±${delta} of ${expected}`,
            failureMessage,
        );
    }
}

function isNotApproximately(
    actual: number,
    expected: number,
    delta: number,
    failureMessage?: string | undefined,
) {
    if (actual >= expected - delta && actual <= expected + delta) {
        throw new AssertionError(`${actual} is within ±${delta} of ${expected}`, failureMessage);
    }
}

const assertions: {
    /**
     * Asserts that a number is above the expectation (`actual > expected`).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isAbove(10, 5); // passes
     * assert.isAbove(5, 5); // fails
     * assert.isAbove(5, 10); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isBelow} : the opposite assertion.
     * - {@link assert.isAtLeast} : the more lenient assertion.
     */
    isAbove: typeof isAbove;
    /**
     * Asserts that a number is at least the expectation (`actual >= expected`).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isAtLeast(10, 5); // passes
     * assert.isAtLeast(5, 5); // passes
     * assert.isAtLeast(5, 10); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isAtMost} : the opposite assertion.
     * - {@link assert.isAbove} : the more restrictive assertion.
     */
    isAtLeast: typeof isAtLeast;
    /**
     * Asserts that a number is below the expectation (`actual < expected`).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isBelow(10, 5); // fails
     * assert.isBelow(5, 5); // fails
     * assert.isBelow(5, 10); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isAbove} : the opposite assertion.
     * - {@link assert.isAtMost} : the more lenient assertion.
     */
    isBelow: typeof isBelow;
    /**
     * Asserts that a number is at most the expectation (`actual <= expected`).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isAtMost(10, 5); // fails
     * assert.isAtMost(5, 5); // passes
     * assert.isAtMost(5, 10); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isAtLeast} : the opposite assertion.
     * - {@link assert.isBelow} : the more restrictive assertion.
     */
    isAtMost: typeof isAtMost;

    /**
     * Asserts that a number is
     * [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNaN(10); // fails
     * assert.isNaN(parseInt('invalid')); // passes
     * assert.isNaN(Infinity); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNumber} : can be used as the opposite assertion.
     */
    isNaN: typeof isNaNGuard;
    /**
     * Asserts that a number is finite: meaning, not `NaN` and not `Infinity` or `-Infinity`.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isFinite(10); // passes
     * assert.isFinite(parseInt('invalid')); // fails
     * assert.isFinite(Infinity); // fails
     * assert.isFinite(-Infinity); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNaN} : an opposite assertion.
     * - {@link assert.isInfinite} : an opposite assertion.
     */
    isFinite: typeof isFiniteGuard;
    /**
     * Asserts that a number is either `Infinity` or `-Infinity`.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isInfinite(10); // fails
     * assert.isInfinite(parseInt('invalid')); // fails
     * assert.isInfinite(Infinity); // passes
     * assert.isInfinite(-Infinity); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNaN} : an opposite assertion.
     * - {@link assert.isInfinite} : an opposite assertion.
     */
    isInfinite: typeof isInfinite;
    /**
     * Asserts that a number is within ±`delta` of the expectation.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isApproximately(10, 8, 4); // passes
     * assert.isApproximately(10, 12, 4); // passes
     * assert.isApproximately(10, 8, 1); // fails
     * assert.isApproximately(10, 12, 1); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNotApproximately} : the opposite assertion.
     */
    isApproximately: typeof isApproximately;
    /**
     * Asserts that a number is outside ±`delta` of the expectation.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotApproximately(10, 8, 4); // fails
     * assert.isNotApproximately(10, 12, 4); // fails
     * assert.isNotApproximately(10, 8, 1); // passes
     * assert.isNotApproximately(10, 12, 1); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isApproximately} : the opposite assertion.
     */
    isNotApproximately: typeof isNotApproximately;
} = {
    isAbove,
    isAtLeast,
    isBelow,
    isAtMost,
    isNaN: isNaNGuard,
    isFinite: isFiniteGuard,
    isInfinite,
    isApproximately,
    isNotApproximately,
};

export const numericGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a number is above the expectation (`actual > expected`).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isAbove(10, 5); // returns `true`
         * check.isAbove(5, 5); // returns `false`
         * check.isAbove(5, 10); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isBelow} : the opposite check.
         * - {@link check.isAtLeast} : the more lenient check.
         */
        isAbove: autoGuardSymbol,
        /**
         * Checks that a number is at least the expectation (`actual >= expected`).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isAtLeast(10, 5); // returns `true`
         * check.isAtLeast(5, 5); // returns `true`
         * check.isAtLeast(5, 10); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isAtMost} : the opposite check.
         * - {@link check.isAbove} : the more restrictive check.
         */
        isAtLeast: autoGuardSymbol,
        /**
         * Checks that a number is below the expectation (`actual < expected`).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isBelow(10, 5); // returns `false`
         * check.isBelow(5, 5); // returns `false`
         * check.isBelow(5, 10); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isAbove} : the opposite check.
         * - {@link check.isAtMost} : the more lenient check.
         */
        isBelow: autoGuardSymbol,
        /**
         * Checks that a number is at most the expectation (`actual <= expected`).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isAtMost(10, 5); // returns `false`
         * check.isAtMost(5, 5); // returns `true`
         * check.isAtMost(5, 10); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isAtLeast} : the opposite check.
         * - {@link check.isBelow} : the more restrictive check.
         */
        isAtMost: autoGuardSymbol,
        /**
         * Checks that a number is
         * [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNaN(10); // returns `false`
         * check.isNaN(parseInt('invalid')); // returns `true`
         * check.isNaN(Infinity); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNumber} : can be used as the opposite check.
         */
        isNaN: autoGuardSymbol,
        /**
         * Checks that a number is finite: meaning, not `NaN` and not `Infinity` or `-Infinity`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isFinite(10); // returns `true`
         * check.isFinite(parseInt('invalid')); // returns `false`
         * check.isFinite(Infinity); // returns `false`
         * check.isFinite(-Infinity); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNaN} : an opposite check.
         * - {@link check.isInfinite} : an opposite check.
         */
        isFinite: autoGuardSymbol,
        /**
         * Checks that a number is either `Infinity` or `-Infinity`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isInfinite(10); // returns `false`
         * check.isInfinite(parseInt('invalid')); // returns `false`
         * check.isInfinite(Infinity); // returns `true`
         * check.isInfinite(-Infinity); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isNaN} : an opposite check.
         * - {@link check.isInfinite} : an opposite check.
         */
        isInfinite: autoGuardSymbol,
        /**
         * Checks that a number is within ±`delta` of the expectation.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isApproximately(10, 8, 4); // returns `true`
         * check.isApproximately(10, 12, 4); // returns `true`
         * check.isApproximately(10, 8, 1); // returns `false`
         * check.isApproximately(10, 12, 1); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotApproximately} : the opposite check.
         */
        isApproximately: autoGuardSymbol,
        /**
         * Checks that a number is outside ±`delta` of the expectation.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotApproximately(10, 8, 4); // returns `false`
         * check.isNotApproximately(10, 12, 4); // returns `false`
         * check.isNotApproximately(10, 8, 1); // returns `true`
         * check.isNotApproximately(10, 12, 1); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isApproximately} : the opposite check.
         */
        isNotApproximately: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * Asserts that a number is above the expectation (`actual > expected`). Returns the number
         * if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isAbove(10, 5); // returns `10`
         * assertWrap.isAbove(5, 5); // throws an error
         * assertWrap.isAbove(5, 10); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isBelow} : the opposite assertion.
         * - {@link assertWrap.isAtLeast} : the more lenient assertion.
         */
        isAbove: autoGuardSymbol,
        /**
         * Asserts that a number is at least the expectation (`actual >= expected`). Returns the
         * number if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isAtLeast(10, 5); // returns `10`
         * assertWrap.isAtLeast(5, 5); // returns `5`
         * assertWrap.isAtLeast(5, 10); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isAtMost} : the opposite assertion.
         * - {@link assertWrap.isAbove} : the more restrictive assertion.
         */
        isAtLeast: autoGuardSymbol,
        /**
         * Asserts that a number is below the expectation (`actual < expected`). Returns the number
         * if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isBelow(10, 5); // throws an error
         * assertWrap.isBelow(5, 5); // throws an error
         * assertWrap.isBelow(5, 10); // returns `5`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isAbove} : the opposite assertion.
         * - {@link assertWrap.isAtMost} : the more lenient assertion.
         */
        isBelow: autoGuardSymbol,
        /**
         * Asserts that a number is at most the expectation (`actual <= expected`). Returns the
         * number if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isAtMost(10, 5); // throws an error
         * assertWrap.isAtMost(5, 5); // returns `5`
         * assertWrap.isAtMost(5, 10); // returns `5`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isAtLeast} : the opposite assertion.
         * - {@link assertWrap.isBelow} : the more restrictive assertion.
         */
        isAtMost: autoGuardSymbol,
        /**
         * Asserts that a number is
         * [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
         * Returns the number if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNaN(10); // throws an error
         * assertWrap.isNaN(parseInt('invalid')); // returns `NaN`
         * assertWrap.isNaN(Infinity); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNumber} : can be used as the opposite assertion.
         */
        isNaN: autoGuardSymbol,
        /**
         * Asserts that a number is finite: meaning, not `NaN` and not `Infinity` or `-Infinity`.
         * Returns the number if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isFinite(10); // returns `10`
         * assertWrap.isFinite(parseInt('invalid')); // throws an error
         * assertWrap.isFinite(Infinity); // throws an error
         * assertWrap.isFinite(-Infinity); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNaN} : an opposite assertion.
         * - {@link assertWrap.isInfinite} : an opposite assertion.
         */
        isFinite: autoGuardSymbol,
        /**
         * Asserts that a number is either `Infinity` or `-Infinity`. Returns the number if the
         * assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isInfinite(10); // throws an error
         * assertWrap.isInfinite(parseInt('invalid')); // throws an error
         * assertWrap.isInfinite(Infinity); // returns `Infinity`
         * assertWrap.isInfinite(-Infinity); // returns `-Infinity`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNaN} : an opposite assertion.
         * - {@link assertWrap.isInfinite} : an opposite assertion.
         */
        isInfinite: autoGuardSymbol,
        /**
         * Asserts that a number is within ±`delta` of the expectation. Returns the number if the
         * assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isApproximately(10, 8, 4); // returns `10`
         * assertWrap.isApproximately(10, 12, 4); // returns `10`
         * assertWrap.isApproximately(10, 8, 1); // throws an error
         * assertWrap.isApproximately(10, 12, 1); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotApproximately} : the opposite assertion.
         */
        isApproximately: autoGuardSymbol,
        /**
         * Asserts that a number is outside ±`delta` of the expectation. Returns the number if the
         * assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotApproximately(10, 8, 4); // throws an error
         * assertWrap.isNotApproximately(10, 12, 4); // throws an error
         * assertWrap.isNotApproximately(10, 8, 1); // returns `10`
         * assertWrap.isNotApproximately(10, 12, 1); // returns `10`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isApproximately} : the opposite assertion.
         */
        isNotApproximately: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * Checks that a number is above the expectation (`actual > expected`). Returns the number
         * if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isAbove(10, 5); // returns `10`
         * checkWrap.isAbove(5, 5); // returns `undefined`
         * checkWrap.isAbove(5, 10); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isBelow} : the opposite check.
         * - {@link checkWrap.isAtLeast} : the more lenient check.
         */
        isAbove: autoGuardSymbol,
        /**
         * Checks that a number is at least the expectation (`actual >= expected`). Returns the
         * number if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isAtLeast(10, 5); // returns `10`
         * checkWrap.isAtLeast(5, 5); // returns `5`
         * checkWrap.isAtLeast(5, 10); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isAtMost} : the opposite check.
         * - {@link checkWrap.isAbove} : the more restrictive check.
         */
        isAtLeast: autoGuardSymbol,
        /**
         * Checks that a number is below the expectation (`actual < expected`). Returns the number
         * if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isBelow(10, 5); // returns `undefined`
         * checkWrap.isBelow(5, 5); // returns `undefined`
         * checkWrap.isBelow(5, 10); // returns `5`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isAbove} : the opposite check.
         * - {@link checkWrap.isAtMost} : the more lenient check.
         */
        isBelow: autoGuardSymbol,
        /**
         * Checks that a number is at most the expectation (`actual <= expected`). Returns the
         * number if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isAtMost(10, 5); // returns `undefined`
         * checkWrap.isAtMost(5, 5); // returns `5`
         * checkWrap.isAtMost(5, 10); // returns `5`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isAtLeast} : the opposite check.
         * - {@link checkWrap.isBelow} : the more restrictive check.
         */
        isAtMost: autoGuardSymbol,
        /**
         * Checks that a number is
         * [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
         * Returns the number if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNaN(10); // returns `undefined`
         * checkWrap.isNaN(parseInt('invalid')); // returns `NaN`
         * checkWrap.isNaN(Infinity); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNumber} : can be used as the opposite check.
         */
        isNaN: autoGuardSymbol,
        /**
         * Checks that a number is finite: meaning, not `NaN` and not `Infinity` or `-Infinity`.
         * Returns the number if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isFinite(10); // returns `10`
         * checkWrap.isFinite(parseInt('invalid')); // returns `undefined`
         * checkWrap.isFinite(Infinity); // returns `undefined`
         * checkWrap.isFinite(-Infinity); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNaN} : an opposite check.
         * - {@link checkWrap.isInfinite} : an opposite check.
         */
        isFinite: autoGuardSymbol,
        /**
         * Checks that a number is either `Infinity` or `-Infinity`. Returns the number if the check
         * passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isInfinite(10); // returns `undefined`
         * checkWrap.isInfinite(parseInt('invalid')); // returns `undefined`
         * checkWrap.isInfinite(Infinity); // returns `Infinity`
         * checkWrap.isInfinite(-Infinity); // returns `-Infinity`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNaN} : an opposite check.
         * - {@link checkWrap.isInfinite} : an opposite check.
         */
        isInfinite: autoGuardSymbol,
        /**
         * Checks that a number is within ±`delta` of the expectation. Returns the number if the
         * check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isApproximately(10, 8, 4); // returns `10`
         * checkWrap.isApproximately(10, 12, 4); // returns `10`
         * checkWrap.isApproximately(10, 8, 1); // returns `undefined`
         * checkWrap.isApproximately(10, 12, 1); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNotApproximately} : the opposite check.
         */
        isApproximately: autoGuardSymbol,
        /**
         * Checks that a number is outside ±`delta` of the expectation. Returns the number if the
         * check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotApproximately(10, 8, 4); // returns `undefined`
         * checkWrap.isNotApproximately(10, 12, 4); // returns `undefined`
         * checkWrap.isNotApproximately(10, 8, 1); // returns `10`
         * checkWrap.isNotApproximately(10, 12, 1); // returns `10`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isApproximately} : the opposite check.
         */
        isNotApproximately: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a number that is above the expectation
         * (`actual > expected`). Once the callback output passes, it is returned. If the attempts
         * time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isAbove(5, () => 10); // returns `10`
         * await waitUntil.isAbove(5, () => 5); // throws an error
         * await waitUntil.isAbove(10, () => 5); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isBelow} : the opposite assertion.
         * - {@link waitUntil.isAtLeast} : the more lenient assertion.
         */
        isAbove: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is at least the expectation
         * (`actual >= expected`). Once the callback output passes, it is returned. If the attempts
         * time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isAtLeast(5, () => 10); // returns `10`
         * await waitUntil.isAtLeast(5, () => 5); // returns `5`
         * await waitUntil.isAtLeast(10, () => 5); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isAtMost} : the opposite assertion.
         * - {@link waitUntil.isAbove} : the more restrictive assertion.
         */
        isAtLeast: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is below the expectation
         * (`actual < expected`). Once the callback output passes, it is returned. If the attempts
         * time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isBelow(5, () => 10); // throws an error
         * await waitUntil.isBelow(5, () => 5); // throws an error
         * await waitUntil.isBelow(10, () => 5); // returns `5`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isAbove} : the opposite assertion.
         * - {@link waitUntil.isAtMost} : the more lenient assertion.
         */
        isBelow: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is at most the expectation
         * (`actual <= expected`). Once the callback output passes, it is returned. If the attempts
         * time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isAtMost(5, () => 10); // throws an error
         * await waitUntil.isAtMost(5, () => 5); // returns `5`
         * await waitUntil.isAtMost(10, () => 5); // returns `5`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isAtLeast} : the opposite assertion.
         * - {@link waitUntil.isBelow} : the more restrictive assertion.
         */
        isAtMost: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is
         * [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
         * Once the callback output passes, it is returned. If the attempts time out, an error is
         * thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNaN(() => 10); // throws an error
         * await waitUntil.isNaN(() => parseInt('invalid')); // returns `NaN`
         * await waitUntil.isNaN(() => Infinity); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNumber} : can be used as the opposite assertion.
         */
        isNaN: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is finite: meaning, not
         * `NaN` and not `Infinity` or `-Infinity`. Once the callback output passes, it is returned.
         * If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isFinite(() => 10); // returns `10`
         * await waitUntil.isFinite(() => parseInt('invalid')); // throws an error
         * await waitUntil.isFinite(() => Infinity); // throws an error
         * await waitUntil.isFinite(() => -Infinity); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNaN} : an opposite assertion.
         * - {@link waitUntil.isInfinite} : an opposite assertion.
         */
        isFinite: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is either `Infinity` or
         * `-Infinity`. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isInfinite(() => 10); // throws an error
         * await waitUntil.isInfinite(() => parseInt('invalid')); // throws an error
         * await waitUntil.isInfinite(() => Infinity); // returns `Infinity`
         * await waitUntil.isInfinite(() => -Infinity); // returns `-Infinity`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNaN} : an opposite assertion.
         * - {@link waitUntil.isInfinite} : an opposite assertion.
         */
        isInfinite: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is within ±`delta` of the
         * expectation. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isApproximately(8, 4, () => 10); // returns `10`
         * await waitUntil.isApproximately(12, 4, () => 10); // returns `10`
         * await waitUntil.isApproximately(8, 1, () => 10); // throws an error
         * await waitUntil.isApproximately(12, 1, () => 10); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNotApproximately} : the opposite assertion.
         */
        isApproximately: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a number that is outside ±`delta` of the
         * expectation. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotApproximately(8, 4, () => 10); // throws an error
         * await waitUntil.isNotApproximately(12, 4, () => 10); // throws an error
         * await waitUntil.isNotApproximately(8, 1, () => 10); // returns `10`
         * await waitUntil.isNotApproximately(12, 1, () => 10); // returns `10`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isApproximately} : the opposite assertion.
         */
        isNotApproximately: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
