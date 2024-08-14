import {AnyObject, MaybePromise} from '@augment-vir/core';
import {AssertionError} from '../../assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard} from '../../guard-types/guard-override.js';
import {WaitUntilOptions} from '../../guard-types/wait-until-function.js';
import type {NarrowToExpected} from '../narrow-type.js';
import {strictEquals} from './simple-equality.js';

function entriesEqual<const Actual extends object, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!actual || typeof actual !== 'object') {
        throw new AssertionError('Actual input is not an object.', failureMessage);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (!expected || typeof expected !== 'object') {
        throw new AssertionError('Expected input is not an object.', failureMessage);
    }

    const allKeys = Array.from(
        new Set([
            ...Reflect.ownKeys(actual),
            ...Reflect.ownKeys(expected),
        ]),
    );

    allKeys.forEach((key) => {
        const actualValue = (actual as AnyObject)[key];
        const expectedValue = (expected as AnyObject)[key];

        try {
            strictEquals(actualValue, expectedValue);
        } catch {
            throw new AssertionError(
                `Entries are not equal at key '${String(key)}'.`,
                failureMessage,
            );
        }
    });
}

function notEntriesEqual(actual: object, expected: object, failureMessage?: string | undefined) {
    try {
        entriesEqual(actual, expected);
    } catch {
        return;
    }

    throw new AssertionError('Entries are equal.', failureMessage);
}

const assertions: {
    entriesEqual: typeof entriesEqual;
    notEntriesEqual: typeof notEntriesEqual;
} = {
    entriesEqual,
    notEntriesEqual,
};

export const entryEqualityGuards = {
    assertions,
    checkOverrides: {
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
    },
    assertWrapOverrides: {
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
    },
    checkWrapOverrides: {
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => NarrowToExpected<Actual, Expected> | undefined
            >(),
    },
    waitUntilOverrides: {
        entriesEqual:
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
