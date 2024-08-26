import type {MaybePromise} from '@augment-vir/core';
import {stringify} from '@augment-vir/core';
import {Primitive} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

export type {Primitive} from 'type-fest';

/** Asserts that the given value is a primitive. */
function isPrimitive(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is Primitive {
    /**
     * `null` is a primitive but `typeof null` gives `'object'` so we have to special case `null`
     * here.
     */
    if (input !== null && (typeof input === 'object' || typeof input === 'function')) {
        throw new AssertionError(`'${stringify(input)}' is not a Primitive.`, failureMessage);
    }
}
function isNotPrimitive<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is Exclude<Actual, Primitive> {
    try {
        isPrimitive(input);
    } catch {
        return;
    }

    throw new AssertionError(`'${stringify(input)}' is a Primitive.`, failureMessage);
}

/** Asserts that the given value is a PropertyKey ( string | number | symbol). */
function isPropertyKey(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is PropertyKey {
    if (typeof input !== 'string' && typeof input !== 'number' && typeof input !== 'symbol') {
        throw new AssertionError(`'${stringify(input)}' is not a PropertyKey.`, failureMessage);
    }
}
function isNotPropertyKey<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is Exclude<Actual, PropertyKey> {
    try {
        isPropertyKey(input);
    } catch {
        return;
    }

    throw new AssertionError(`'${stringify(input)}' is a PropertyKey.`, failureMessage);
}

const assertions: {
    isPropertyKey: typeof isPropertyKey;
    isNotPropertyKey: typeof isNotPropertyKey;
    isPrimitive: typeof isPrimitive;
    isNotPrimitive: typeof isNotPrimitive;
} = {
    isPropertyKey,
    isNotPropertyKey,
    isPrimitive,
    isNotPrimitive,
};

export const primitiveGuards = {
    assertions,
    checkOverrides: {
        isNotPrimitive:
            autoGuard<<const Actual>(input: Actual) => input is Exclude<Actual, Primitive>>(),
        isNotPropertyKey:
            autoGuard<<const Actual>(input: Actual) => input is Exclude<Actual, PropertyKey>>(),
    },
    assertWrapOverrides: {
        isNotPrimitive:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Primitive>
            >(),
        isNotPropertyKey:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, PropertyKey>
            >(),
    },
    checkWrapOverrides: {
        isNotPrimitive:
            autoGuard<<const Actual>(input: Actual) => Exclude<Actual, Primitive> | undefined>(),
        isNotPropertyKey:
            autoGuard<<const Actual>(input: Actual) => Exclude<Actual, PropertyKey> | undefined>(),
    },
    waitUntilOverrides: {
        isNotPrimitive:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, Primitive>>
            >(),
        isNotPropertyKey:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, PropertyKey>>
            >(),
    },
} satisfies GuardGroup;
