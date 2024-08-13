import {AssertionError} from '../assertion.error.js';

function matches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (!expected.test(actual)) {
        throw new AssertionError(failureMessage || `'${actual}' does not match ${expected}`);
    }
}

const assertions: {
    matches: typeof matches;
} = {
    matches,
};

export const regexpGuards = {
    assertions,
};
