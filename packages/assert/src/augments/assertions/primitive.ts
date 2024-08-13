import JSON5 from 'json5';
import {Primitive} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';

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
        throw new AssertionError(
            failureMessage || `'${JSON5.stringify(input)}' is not a Primitive.`,
        );
    }
}

/** Asserts that the given value is a PropertyKey ( string | number | symbol). */
function isPropertyKey(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is PropertyKey {
    if (typeof input !== 'string' && typeof input !== 'number' && typeof input !== 'symbol') {
        throw new AssertionError(
            failureMessage || `'${JSON5.stringify(input)}' is not a PropertyKey.`,
        );
    }
}

const assertions: {
    isPropertyKey: typeof isPropertyKey;
    isPrimitive: typeof isPrimitive;
} = {
    isPropertyKey,
    isPrimitive,
};

export const primitiveGuards = {
    assertions,
} satisfies GuardGroup;
