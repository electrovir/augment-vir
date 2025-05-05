import {AssertionError} from '../augments/assertion.error.js';
import {type GuardGroup} from '../guard-types/guard-group.js';

export const assertions = {
    /**
     * Immediately throws an assertion error if ever executed. Use this to mark paths of the code
     * that should never be reached or executed.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.never(); // throws an error
     * ```
     *
     * @throws {@link AssertionError} If ever called.
     */
    never(
        /** Message to include in error message if this assertion ever runs. */
        failureMessage?: string | undefined,
    ): never {
        throw new AssertionError('This code should not have executed.', failureMessage);
    },
};

export const neverGuard = {
    assert: assertions,
    assertWrap: {},
    check: {},
    checkWrap: {},
    waitUntil: {},
} satisfies GuardGroup<typeof assertions>;
