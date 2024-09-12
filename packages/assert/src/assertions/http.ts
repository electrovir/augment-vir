import {
    HttpStatus,
    httpStatusByCategory,
    stringify,
    type HttpStatusByCategory,
    type HttpStatusCategory,
    type MaybePromise,
    type NarrowToExpected,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../guard-types/guard-override.js';
import type {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import {isEnumValue} from './enum.js';
import {isIn} from './values.js';

function isHttpStatus(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is HttpStatus {
    try {
        isEnumValue(actual, HttpStatus);
    } catch {
        throw new AssertionError(
            `${stringify(actual)} is not a valid http status.`,
            failureMessage,
        );
    }
}

function isHttpStatusCategory<const Actual, const Category extends HttpStatusCategory>(
    actual: Actual,
    category: Category,
    failureMessage?: string | undefined,
): asserts actual is NarrowToExpected<Actual, HttpStatusByCategory<Category>> {
    try {
        isEnumValue(actual, HttpStatus);
        isIn(actual, httpStatusByCategory[category]);
    } catch {
        throw new AssertionError(
            `${stringify(actual)} is not a '${category}' http status.`,
            failureMessage,
        );
    }
}

const assertions: {
    /**
     * Asserts that a value is an {@link HttpStatus}.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isHttpStatus(400); // passes
     * assert.isHttpStatus(500); // passes
     * assert.isHttpStatus(99); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not an {@link HttpStatus}.
     * @see
     * - {@link assert.isHttpStatusCategory} : the category assertion.
     * - {@link HttpStatus} : all included statuses.
     * - {@link HttpStatusCategory} : all status categories.
     */
    isHttpStatus: typeof isHttpStatus;
    /**
     * Asserts that a value is an {@link HttpStatus} within a specific {@link HttpStatusCategory}.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isHttpStatusCategory(400, HttpStatusCategory.ClientError); // passes
     * assert.isHttpStatusCategory(500, HttpStatusCategory.Success); // fails
     * assert.isHttpStatusCategory(99, HttpStatusCategory.Information); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not an {@link HttpStatus} within the
     *   {@link HttpStatusCategory}.
     * @see
     * - {@link assert.isHttpStatus} : the status assertion.
     * - {@link HttpStatus} : all included statuses.
     * - {@link HttpStatusCategory} : all status categories.
     */
    isHttpStatusCategory: typeof isHttpStatusCategory;
} = {
    isHttpStatus,
    isHttpStatusCategory,
};

export const httpGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is an {@link HttpStatus}.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isHttpStatus(400); // returns `true`
         * check.isHttpStatus(500); // returns `true`
         * check.isHttpStatus(99); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isHttpStatusCategory} : the category check.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatus: autoGuardSymbol,
        /**
         * Checks that a value is an {@link HttpStatus} within a specific {@link HttpStatusCategory}.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isHttpStatusCategory(400, HttpStatusCategory.ClientError); // returns `true`
         * check.isHttpStatusCategory(500, HttpStatusCategory.Success); // returns `false`
         * check.isHttpStatusCategory(99, HttpStatusCategory.Information); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isHttpStatus} : the status check.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    actual: Actual,
                    category: Category,
                    failureMessage?: string | undefined,
                ) => actual is NarrowToExpected<Actual, HttpStatusByCategory<Category>>
            >(),
    },
    assertWrap: {
        /**
         * Asserts that a value is an {@link HttpStatus}. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isHttpStatus(400); // returns `400`
         * assertWrap.isHttpStatus(500); // returns `500`
         * assertWrap.isHttpStatus(99); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the value is not an {@link HttpStatus}.
         * @see
         * - {@link assertWrap.isHttpStatusCategory} : the category assertion.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatus: autoGuardSymbol,
        /**
         * Checks that a value is an {@link HttpStatus} within a specific {@link HttpStatusCategory}.
         * Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isHttpStatusCategory(400, HttpStatusCategory.ClientError); // returns `400`
         * assertWrap.isHttpStatusCategory(500, HttpStatusCategory.Success); // throws an error
         * assertWrap.isHttpStatusCategory(99, HttpStatusCategory.Information); // throws an error
         * ```
         *
         * @see
         * - {@link assertWrap.isHttpStatus} : the status assertion.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    actual: Actual,
                    category: Category,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, HttpStatusByCategory<Category>>
            >(),
    },
    checkWrap: {
        /**
         * Checks that a value is an {@link HttpStatus}. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isHttpStatus(400); // returns `400`
         * checkWrap.isHttpStatus(500); // returns `500`
         * checkWrap.isHttpStatus(99); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isHttpStatusCategory} : the category check.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatus: autoGuardSymbol,
        /**
         * Checks that a value is an {@link HttpStatus} within a specific {@link HttpStatusCategory}.
         * Returns the value if the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isHttpStatusCategory(400, HttpStatusCategory.ClientError); // returns `400`
         * checkWrap.isHttpStatusCategory(500, HttpStatusCategory.Success); // returns `undefined`
         * checkWrap.isHttpStatusCategory(99, HttpStatusCategory.Information); // returns `undefined`
         * ```
         *
         * @see
         * - {@link checkWrap.isHttpStatus} : the status check.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    actual: Actual,
                    category: Category,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, HttpStatusByCategory<Category>> | undefined
            >(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an {@link HttpStatus}. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isHttpStatus(() => 400); // returns `400`
         * await waitUntil.isHttpStatus(() => 500); // returns `500`
         * await waitUntil.isHttpStatus(() => 99); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isHttpStatusCategory} : the category assertion.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatus: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is an {@link HttpStatus} within a specific
         * {@link HttpStatusCategory}. Once the callback output passes, it is returned. If the
         * attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isHttpStatusCategory(HttpStatusCategory.ClientError, () => 400); // returns `400`
         * await waitUntil.isHttpStatusCategory(HttpStatusCategory.Success, () => 500); // throws an error more
         * await waitUntil.isHttpStatusCategory(HttpStatusCategory.Information, () => 99); // throws an error more
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isHttpStatus} : the status assertion.
         * - {@link HttpStatus} : all included statuses.
         * - {@link HttpStatusCategory} : all status categories.
         */
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    category: Category,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, HttpStatusByCategory<Category>>>
            >(),
    },
} satisfies GuardGroup<typeof assertions>;
