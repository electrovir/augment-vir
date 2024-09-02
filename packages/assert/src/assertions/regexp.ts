import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuardSymbol} from '../guard-types/guard-override.js';

function matches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (!expected.test(actual)) {
        throw new AssertionError(`'${actual}' does _not_ match ${expected}`, failureMessage);
    }
}
function mismatches(actual: string, expected: RegExp, failureMessage?: string | undefined) {
    if (expected.test(actual)) {
        throw new AssertionError(`'${actual}' matches ${expected}`, failureMessage);
    }
}

const assertions: {
    /**
     * Asserts that a string (first input, `actual`) matches a RegExp (second input, `expected`).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.matches('hi', /^h/); // passes
     * assert.matches('hi', /^g/); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.mismatches} : the opposite assertion.
     */
    matches: typeof matches;
    /**
     * Asserts that a string (first input, `actual`) does _not_ match a RegExp (second input,
     * `expected`).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.mismatches('hi', /^h/); // fails
     * assert.mismatches('hi', /^g/); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.matches} : the opposite assertion.
     */
    mismatches: typeof mismatches;
} = {
    matches,
    mismatches,
};

export const regexpGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a string (first input, `actual`) matches a RegExp (second input, `expected`).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.matches('hi', /^h/); // returns `true`
         * check.matches('hi', /^g/); // returns `false`
         * ```
         *
         * @see
         * - {@link check.mismatches} : the opposite check.
         */
        matches: autoGuardSymbol,
        /**
         * Checks that a string (first input, `actual`) does _not_ match a RegExp (second input,
         * `expected`).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.mismatches('hi', /^h/); // returns `false`
         * check.mismatches('hi', /^g/); // returns `true`
         * ```
         *
         * @see
         * - {@link check.matches} : the opposite check.
         */
        mismatches: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * Asserts that a string (first input, `actual`) matches a RegExp (second input,
         * `expected`). Returns the string if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.matches('hi', /^h/); // returns `'hi'`
         * assertWrap.matches('hi', /^g/); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.mismatches} : the opposite assertion.
         */
        matches: autoGuardSymbol,
        /**
         * Asserts that a string (first input, `actual`) does _not_ match a RegExp (second input,
         * `expected`). Returns the string if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.mismatches('hi', /^h/); // throws an error
         * assertWrap.mismatches('hi', /^g/); // returns `'hi'`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.matches} : the opposite assertion.
         */
        mismatches: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * Checks that a string (first input, `actual`) matches a RegExp (second input, `expected`).
         * Returns the string if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.matches('hi', /^h/); // returns `'hi'`
         * checkWrap.matches('hi', /^g/); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.mismatches} : the opposite check.
         */
        matches: autoGuardSymbol,
        /**
         * Checks that a string (first input, `actual`) does _not_ match a RegExp (second input,
         * `expected`). Returns the string if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.mismatches('hi', /^h/); // returns `undefined`
         * checkWrap.mismatches('hi', /^g/); // returns `'hi'`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.matches} : the opposite check.
         */
        mismatches: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a string that matches a RegExp (first
         * input, `expected`). Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.matches(/^h/, () => 'hi'); // returns `'hi'`
         * await waitUntil.matches(/^g/, () => 'hi'); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.mismatches} : the opposite assertion.
         */
        matches: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is a string that does _not_ match a RegExp
         * (first input, `expected`). Once the callback output passes, it is returned. If the
         * attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.mismatches(/^h/, () => 'hi'); // throws an error
         * await waitUntil.mismatches(/^g/, () => 'hi'); // returns `'hi'`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.matches} : the opposite assertion.
         */
        mismatches: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
