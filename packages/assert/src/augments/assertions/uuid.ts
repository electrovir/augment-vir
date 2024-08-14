import {MaybePromise, UuidV4} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

const uuidRegExp = /^[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}$/;

/** Checks if the input string is a valid v4 UUID. */
function isUuid(actual: unknown, failureMessage?: string | undefined): asserts actual is UuidV4 {
    if (!String(actual).match(uuidRegExp)) {
        throw new AssertionError(`'${String(actual)}' is not a UUID.`, failureMessage);
    }
}
function isNotUuid<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, UuidV4> {
    if (String(actual).match(uuidRegExp)) {
        throw new AssertionError(`'${String(actual)}' is a UUID.`, failureMessage);
    }
}

const assertions: {
    isUuid: typeof isUuid;
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
                ) => actual is Exclude<Actual, UuidV4>
            >(),
    },
    assertWrapOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, UuidV4>
            >(),
    },
    checkWrapOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, UuidV4> | undefined
            >(),
    },
    waitUntilOverrides: {
        isNotUuid:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, UuidV4>>
            >(),
    },
} satisfies GuardGroup;
