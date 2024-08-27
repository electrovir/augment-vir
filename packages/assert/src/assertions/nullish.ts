import {MaybePromise, stringify} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

function isDefined<const Actual>(
    /** The value to check. */
    input: Actual,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts input is Exclude<Actual, undefined | null> {
    if (input == undefined) {
        throw new AssertionError(`'${stringify(input)}' is not defined.`, failureMessage);
    }
}

function isNullish(
    /** The value to check. */
    input: unknown,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts input is null | undefined {
    if (input != undefined) {
        throw new AssertionError(`'${stringify(input)}' is not a nullish.`, failureMessage);
    }
}

const assertions: {
    /**
     * Checks that a value is defined (not `null` and not `undefined`).
     *
     * Type guards the value.
     */
    isDefined: typeof isDefined;
    /**
     * Checks that a value is nullish (`null` or `undefined`).
     *
     * Type guards the value.
     */
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
