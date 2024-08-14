import {AssertionError} from '../assertion.error.js';
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

function isFinite(actual: number, failureMessage?: string | undefined) {
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
    isAbove: typeof isAbove;
    isAtLeast: typeof isAtLeast;
    isBelow: typeof isBelow;
    isAtMost: typeof isAtMost;
    isNaN: typeof isNaNGuard;
    isFinite: typeof isFinite;
    isInfinite: typeof isInfinite;
    isApproximately: typeof isApproximately;
    isNotApproximately: typeof isNotApproximately;
} = {
    isAbove,
    isAtLeast,
    isBelow,
    isAtMost,
    isNaN: isNaNGuard,
    isFinite,
    isInfinite,
    isApproximately,
    isNotApproximately,
};

export const numericGuards = {
    assertions,
} satisfies GuardGroup;
