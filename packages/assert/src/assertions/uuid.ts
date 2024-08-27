import {MaybePromise, Uuid} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Checks if the input string is a valid v4 UUID. */
function isUuid(actual: unknown, failureMessage?: string | undefined): asserts actual is Uuid {
    if (!String(actual).match(uuidRegExp)) {
        throw new AssertionError(`'${String(actual)}' is not a UUID.`, failureMessage);
    }
}
function isNotUuid<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, Uuid> {
    if (String(actual).match(uuidRegExp)) {
        throw new AssertionError(`'${String(actual)}' is a UUID.`, failureMessage);
    }
}

const assertions: {
    /**
     * Check if the given string is a valid UUID. This supports UUID versions 1-8 and does _not_
     * support the Nil UUID (all zeros) or the Max UUID (all Fs).
     *
     * Type guards the input.
     */
    isUuid: typeof isUuid;
    /**
     * Check if the given string is _not_ a valid UUID.
     *
     * Type guards the input.
     */
    isNotUuid: typeof isNotUuid;
} = {
    isUuid,
    isNotUuid,
};

export const uuidGuards = {
    assertions,
    checkOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, Uuid>
            >(),
    },
    assertWrapOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Uuid>
            >(),
    },
    checkWrapOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Uuid> | undefined
            >(),
    },
    waitUntilOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, Uuid>>
            >(),
    },
} satisfies GuardGroup;
