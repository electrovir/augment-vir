import {AnyObject, extractErrorMessage, MaybePromise, NarrowToExpected} from '@augment-vir/core';
import {AssertionError} from '../../augments/assertion.error.js';
import type {GuardGroup} from '../../augments/guard-types/guard-group.js';
import {autoGuard} from '../../augments/guard-types/guard-override.js';
import {WaitUntilOptions} from '../../augments/guard-types/wait-until-function.js';

function baseJsonEquals(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Check if the inputs are equal via `JSON.stringify` (property order on objects does not matter).
 *
 * @throws `JsonStringifyError` if the inputs fail when passed to `JSON.stringify`.
 */
function jsonEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    try {
        recursiveJsonEquals(actual, expected);
    } catch (error) {
        throw new AssertionError(extractErrorMessage(error), failureMessage);
    }
}

function notJsonEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    try {
        jsonEquals(actual, expected);
    } catch {
        return;
    }

    throw new AssertionError('Values are JSON equal.', failureMessage);
}

function recursiveJsonEquals(actual: any, expected: any) {
    const isBaseJsonEqual = baseJsonEquals(actual, expected);

    if (actual === expected || isBaseJsonEqual) {
        return;
    }

    if (
        actual != null &&
        expected != null &&
        typeof actual === 'object' &&
        typeof expected === 'object'
    ) {
        const aKeys = Object.keys(actual).sort();
        const bKeys = Object.keys(expected).sort();

        if (aKeys.length || bKeys.length) {
            const areKeysEqual = baseJsonEquals(aKeys, bKeys);

            if (!areKeysEqual) {
                throw new Error('Values are JSON equal.');
            }

            Object.keys(actual).forEach((key) => {
                try {
                    jsonEquals((actual as AnyObject)[key], (expected as AnyObject)[key]);
                } catch (error) {
                    throw new Error(
                        `JSON objects are not equal at key '${key}': ${extractErrorMessage(error)}`,
                    );
                }
            });
        }
    }

    throw new Error('Values are not JSON equal.');
}

const assertions: {
    jsonEquals: typeof jsonEquals;
    notJsonEquals: typeof notJsonEquals;
} = {
    jsonEquals,
    notJsonEquals,
};

export const jsonEqualityGuards = {
    assertions,
    checkOverrides: {
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
    },
    assertWrapOverrides: {
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
    },
    checkWrapOverrides: {
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => NarrowToExpected<Actual, Expected> | undefined
            >(),
    },
    waitUntilOverrides: {
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    expected: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),
    },
} satisfies GuardGroup;
