import {MaybePromise} from '@augment-vir/core';
import deepEqual from 'deep-eql';
import JSON5 from 'json5';
import {AssertionError} from '../../assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard} from '../../guard-types/guard-override.js';
import {WaitUntilOptions} from '../../guard-types/wait-until-function.js';
import {NarrowToExpected} from '../narrow-type.js';

export function strictEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    if (actual !== expected) {
        throw new AssertionError(
            `${JSON5.stringify(actual)} does not strictly equal ${JSON5.stringify(expected)}`,
            failureMessage,
        );
    }
}
export function notStrictEquals(
    actual: unknown,
    expected: unknown,
    failureMessage?: string | undefined,
) {
    if (actual === expected) {
        throw new AssertionError(
            `${JSON5.stringify(actual)} strictly equals ${JSON5.stringify(expected)}`,
            failureMessage,
        );
    }
}

function looseEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual != expected) {
        throw new AssertionError(
            `${JSON5.stringify(actual)} does not loosely equal ${JSON5.stringify(expected)}`,
            failureMessage,
        );
    }
}

function notLooseEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual == expected) {
        throw new AssertionError(
            `${JSON5.stringify(actual)} loosely equals ${JSON5.stringify(expected)}`,
            failureMessage,
        );
    }
}

function deepEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is NarrowToExpected<Actual, Expected> {
    if (!deepEqual(actual, expected)) {
        throw new AssertionError(
            `${JSON5.stringify(actual)} does not deeply equal ${JSON5.stringify(expected)}`,
            failureMessage,
        );
    }
}

function notDeepEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (deepEqual(actual, expected)) {
        throw new AssertionError(
            `${JSON5.stringify(actual)} deeply equals ${JSON5.stringify(expected)}`,
            failureMessage,
        );
    }
}

const assertions: {
    strictEquals: typeof strictEquals;
    notStrictEquals: typeof notStrictEquals;
    looseEquals: typeof looseEquals;
    notLooseEquals: typeof notLooseEquals;
    deepEquals: typeof deepEquals;
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
