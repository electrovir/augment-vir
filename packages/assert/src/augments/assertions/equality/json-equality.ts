import {extractErrorMessage, type AnyObject} from '@augment-vir/core';
import {AssertionError} from '../../assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard} from '../../guard-types/guard-override.js';
import {WaitUntilOptions} from '../../guard-types/wait-until-function.js';
import {NarrowToExpected} from '../narrow-type.js';

function baseJsonEquals(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Check if the inputs are equal via `JSON.stringify` (property order on objects does not matter).
 *
 * @throws `JsonStringifyError` if the inputs fail when passed to `JSON.stringify`.
 */
export function jsonEquals<Actual, Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    try {
        recursiveJsonEquals(actual, expected);
    } catch (error) {
        const leadingMessage = failureMessage ? failureMessage.replace(/\.$/, '') + ': ' : '';
        throw new AssertionError(`${leadingMessage}${extractErrorMessage(error)}`);
    }
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
                throw new AssertionError(`JSON keys are not equal`);
            }

            Object.keys(actual).forEach((key) => {
                try {
                    jsonEquals((actual as AnyObject)[key], (expected as AnyObject)[key]);
                } catch (error) {
                    throw new AssertionError(
                        `JSON objects are not equal at key '${key}': ${extractErrorMessage(error)}`,
                    );
                }
            });
        }
    }

    throw new AssertionError('JSON values are not equal.');
}

const assertions: {
    jsonEquals: typeof jsonEquals;
} = {
    jsonEquals,
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
                    callback: () => Actual,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),
    },
} satisfies GuardGroup;
