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
    matches: typeof matches;
    mismatches: typeof mismatches;
} = {
    matches,
    mismatches,
};

export const regexpGuards = {
    assertions,
};
