import {AssertionError} from '../assertion.error.js';

function matches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (!expected.test(actual)) {
        throw new AssertionError(failureMessage || `'${actual}' does not match ${expected}`);
    }
}
function mismatches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (expected.test(actual)) {
        throw new AssertionError(failureMessage || `'${actual}' matches ${expected}`);
    }
}

const assertions: {
    matches: typeof matches;
    mismatches: typeof mismatches;
} = {
    matches,
    mismatches,
};

export const regexpGuards = {
    assertions,
};
