import {AssertionError} from '../augments/assertion.error.js';

function matches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (!expected.test(actual)) {
        throw new AssertionError(`'${actual}' does not match ${expected}`, failureMessage);
    }
}
function mismatches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (expected.test(actual)) {
        throw new AssertionError(`'${actual}' matches ${expected}`, failureMessage);
    }
}

const assertions: {
    /**
     * Checks if a string (`actual`) matches a RegExp (`expected`).
     *
     * Performs no type guarding.
     */
    matches: typeof matches;
    /**
     * Checks if a string (`actual`) does _not_ match a RegExp (`expected`).
     *
     * Performs no type guarding.
     */
    mismatches: typeof mismatches;
} = {
    matches,
    mismatches,
};

export const regexpGuards = {
    assertions,
};
