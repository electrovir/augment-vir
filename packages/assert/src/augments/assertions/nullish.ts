import {MaybePromise} from '@augment-vir/core';
import JSON5 from 'json5';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

/** Asserts that the given input is defined (not null and not undefined) */
function isDefined<const Actual>(
    /** The value to check. */
    input: Actual,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts input is Exclude<Actual, undefined | null> {
    if (input == undefined) {
        throw new AssertionError(failureMessage || `'${JSON5.stringify(input)}' is not defined.`);
    }
}

/** Asserts that the given input is null or undefined */
function isNullish(
    /** The value to check. */
    input: unknown,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts input is null | undefined {
    if (input != undefined) {
        throw new AssertionError(failureMessage || `'${JSON5.stringify(input)}' is not a nullish.`);
    }
}

const assertions: {
    isDefined: typeof isDefined;
    isNullish: typeof isNullish;
} = {
    isDefined,
    isNullish,
};

export const nullishGuards = {
    assertions: assertions,
    checkOverrides: {
        isDefined:
            autoGuard<<Actual>(input: Actual) => input is Exclude<Actual, undefined | null>>(),
    },
    assertWrapOverrides: {
        isDefined:
            autoGuard<
                <Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, undefined | null>
            >(),
    },
    /** Nullish checks don't make any sense on `checkWrap`. */
    checkWrapOverrides: {
        isDefined: undefined,
        isNullish: undefined,
    },
    waitUntilOverrides: {
        isDefined:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, undefined | null>>
            >(),
    },
} satisfies GuardGroup;
