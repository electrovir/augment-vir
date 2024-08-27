import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';

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
     * Check if a number is above the expectation (`actual > expected`).
     *
     * Performs no type guarding.
     */
    isAbove: typeof isAbove;
    /**
     * Check if a number is at least the expectation (`actual >= expected`).
     *
     * Performs no type guarding.
     */
    isAtLeast: typeof isAtLeast;
    /**
     * Check if a number is below the expectation (`actual < expected`).
     *
     * Performs no type guarding.
     */
    isBelow: typeof isBelow;
    /**
     * Check if a number is at most the expectation (`actual <= expected`).
     *
     * Performs no type guarding.
     */
    isAtMost: typeof isAtMost;
    /**
     * Check if a number is
     * [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
     *
     * Performs no type guarding.
     */
    isNaN: typeof isNaNGuard;
    /**
     * Check if a number is finite: meaning, not `NaN` and not `Infinity` or `-Infinity`.
     *
     * Performs no type guarding.
     */
    isFinite: typeof isFiniteGuard;
    /**
     * Check if a number is either `Infinity` or `-Infinity`.
     *
     * Performs no type guarding.
     */
    isInfinite: typeof isInfinite;
    /**
     * Check if a number is with ±`delta` of the expectation.
     *
     * Performs no type guarding.
     */
    isApproximately: typeof isApproximately;
    /**
     * Check if a number is outside ±`delta` of the expectation.
     *
     * Performs no type guarding.
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
    assertions,
} satisfies GuardGroup;
