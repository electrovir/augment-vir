import {AssertionError} from '../assertion.error.js';
import {combineFailureMessage} from '../guard-types/combine-failure-message.js';
import type {GuardGroup} from '../guard-types/guard-group.js';

function isAbove(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual <= expected) {
        throw new AssertionError(
            combineFailureMessage(`${actual} is not above ${expected}`, failureMessage),
        );
    }
}

function isAtLeast(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual < expected) {
        throw new AssertionError(
            combineFailureMessage(`${actual} is not at least ${expected}`, failureMessage),
        );
    }
}

function isBelow(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual >= expected) {
        throw new AssertionError(
            combineFailureMessage(`${actual} is not below ${expected}`, failureMessage),
        );
    }
}

function isAtMost(actual: number, expected: number, failureMessage?: string | undefined) {
    if (actual > expected) {
        throw new AssertionError(
            combineFailureMessage(`${actual} is not at most ${expected}`, failureMessage),
        );
    }
}

function isNaNGuard(input: number, failureMessage?: string | undefined) {
    if (!isNaN(input)) {
        throw new AssertionError(combineFailureMessage(`${input} is not NaN`, failureMessage));
    }
}

function isFinite(input: number, failureMessage?: string | undefined) {
    if (isNaN(input) || input === Infinity || input === -Infinity) {
        throw new AssertionError(combineFailureMessage(`${input} is not finite`, failureMessage));
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
            combineFailureMessage(
                `${actual} is not within ±${delta} of ${expected}`,
                failureMessage,
            ),
        );
    }
}

const assertions: {
    isAbove: typeof isAbove;
    isAtLeast: typeof isAtLeast;
    isBelow: typeof isBelow;
    isAtMost: typeof isAtMost;
    isNaN: typeof isNaNGuard;
    isFinite: typeof isFinite;
    isApproximately: typeof isApproximately;
} = {
    isAbove,
    isAtLeast,
    isBelow,
    isAtMost,
    isNaN: isNaNGuard,
    isFinite,
    isApproximately,
};

export const numericGuards = {assertions} satisfies GuardGroup;
