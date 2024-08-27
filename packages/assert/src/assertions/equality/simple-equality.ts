import {MaybePromise, NarrowToExpected, stringify} from '@augment-vir/core';
import deepEqual from 'deep-eql';
import {AssertionError} from '../../augments/assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard} from '../../guard-types/guard-override.js';
import {WaitUntilOptions} from '../../guard-types/wait-until-function.js';

export function strictEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    if (actual !== expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndoes not strictly equal\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}
function notStrictEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual === expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\nstrictly equals\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

function looseEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual != expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndoes not loosely equal\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

function notLooseEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual == expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\nloosely equals\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

export function deepEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is NarrowToExpected<Actual, Expected> {
    if (!deepEqual(actual, expected)) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndoes not deeply equal\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

function notDeepEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (deepEqual(actual, expected)) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndeeply equals\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

const assertions: {
    /**
     * Check that two values are strictly equal (using
     * [`===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
     *
     * Type guards the first value.
     */
    strictEquals: typeof strictEquals;
    /**
     * Check that two values are _not_ strictly equal (using
     * [`===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
     *
     * Performs no type guarding.
     */
    notStrictEquals: typeof notStrictEquals;
    /**
     * Check that two values are loosely equal (using
     * [`==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
     *
     * Performs no type guarding.
     */
    looseEquals: typeof looseEquals;
    /**
     * Check that two values are _not_ loosely equal (using
     * [`==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
     *
     * Performs no type guarding.
     */
    notLooseEquals: typeof notLooseEquals;
    /**
     * Check that two values are deeply equal using the
     * [deep-eql](https://www.npmjs.com/package/deep-eql) package.
     *
     * Note that this check will be _expensive_. Whenever possible, use simpler equality checks
     * instead, such as:
     *
     * - `.strictEquals()`
     * - `.entriesEqual()`
     * - `.jsonEquals()`
     *
     * Type guards the first value.
     */
    deepEquals: typeof deepEquals;
    /**
     * Check that two values are _not_ deeply equal using the
     * [deep-eql](https://www.npmjs.com/package/deep-eql) package.
     *
     * Note that this check will be _expensive_. Whenever possible, use simpler equality checks
     * instead, such as:
     *
     * - `.notStrictEquals()`
     * - `.notEntriesEqual()`
     * - `.notJsonEquals()`
     *
     * Performs no type guarding.
     */
    notDeepEquals: typeof notDeepEquals;
} = {
    strictEquals,
    notStrictEquals,
    looseEquals,
    notLooseEquals,
    deepEquals,
    notDeepEquals,
};

export const simpleEqualityGuards = {
    assertions,
    checkOverrides: {
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
    },
    assertWrapOverrides: {
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
    },
    checkWrapOverrides: {
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => Expected | undefined
            >(),
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => NarrowToExpected<Actual, Expected> | undefined
            >(),
    },
    waitUntilOverrides: {
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    expected: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),
        deepEquals:
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
