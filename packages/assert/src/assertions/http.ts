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
import {autoGuard} from '../guard-types/guard-override.js';
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
    isHttpStatus: typeof isHttpStatus;
    isHttpStatusCategory: typeof isHttpStatusCategory;
} = {
    isHttpStatus,
    isHttpStatusCategory,
};

export const httpGuards = {
    assertions,
    checkOverrides: {
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    actual: Actual,
                    category: Category,
                    failureMessage?: string | undefined,
                ) => actual is NarrowToExpected<Actual, HttpStatusByCategory<Category>>
            >(),
    },
    assertWrapOverrides: {
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    actual: Actual,
                    category: Category,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, HttpStatusByCategory<Category>>
            >(),
    },
    checkWrapOverrides: {
        isHttpStatusCategory:
            autoGuard<
                <const Actual, const Category extends HttpStatusCategory>(
                    actual: Actual,
                    category: Category,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, HttpStatusByCategory<Category>> | undefined
            >(),
    },
    waitUntilOverrides: {
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
} satisfies GuardGroup;
