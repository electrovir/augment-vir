import type {NarrowToActual, NarrowToExpected} from '@augment-vir/core';
import {AnyObject, MaybePromise, stringify, Values} from '@augment-vir/core';
import type {EmptyObject} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import {autoGuard} from '../guard-types/guard-override.js';
import type {WaitUntilOptions} from '../guard-types/wait-until-function.js';

function hasValue(parent: object, value: unknown, failureMessage?: string | undefined) {
    /** Wrap this in a try/catch because `Reflect.ownKeys` can fail depending on what its input is. */
    try {
        const hasValue = Reflect.ownKeys(parent)
            .map((key) => parent[key as keyof typeof parent] as unknown)
            .includes(value);

        if (!hasValue) {
            throw new Error('fail');
        }
    } catch {
        throw new AssertionError(
            `'${stringify(parent)}' does not have value '${stringify(value)}'.`,
            failureMessage,
        );
    }
}
function lacksValue(parent: object, value: unknown, failureMessage?: string | undefined) {
    try {
        hasValue(parent, value);
    } catch {
        return;
    }

    throw new AssertionError(
        `'${stringify(parent)}' has value '${stringify(value)}'.`,
        failureMessage,
    );
}

function hasValues(
    parent: object,
    values: ReadonlyArray<unknown>,
    failureMessage?: string | undefined,
) {
    values.forEach((value) => hasValue(parent, value, failureMessage));
}
function lacksValues(
    parent: object,
    values: ReadonlyArray<unknown>,
    failureMessage?: string | undefined,
) {
    values.forEach((value) => lacksValue(parent, value, failureMessage));
}

export function isIn<const Parent extends object | string>(
    child: unknown,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Values<Parent> {
    if (typeof parent === 'string') {
        if (!parent.includes(child as string)) {
            throw new AssertionError(`${stringify(child)} is not in '${parent}'.`, failureMessage);
        }
    } else {
        hasValue(parent, child, failureMessage);
    }
}
function isNotIn<const Parent extends object | string, const Child>(
    child: Child,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Exclude<Child, Values<Parent>> {
    try {
        isIn(child, parent);
    } catch {
        return;
    }

    throw new AssertionError(`${stringify(child)} is not in ${stringify(parent)}.`, failureMessage);
}

/**
 * All types that can be checked for emptiness. The empty variants of these types are represented in
 * {@link Empty}.
 *
 * @category Assert : Util
 * @package @augment-vir/assert
 */
export type CanBeEmpty = string | Map<any, any> | Set<any> | AnyObject | any[];
/**
 * Empty versions of {@link CanBeEmpty}. Note that there is no way to distinguish an empty `Set` or
 * `Map` from their non-empty counterparts in TypeScript (so you will get no emptiness type safety
 * for them.)
 *
 * @category Assert : Util
 * @package @augment-vir/assert
 */
export type Empty = '' | EmptyObject | [] | Map<any, any> | Set<any>;

function isEmpty<const Actual extends CanBeEmpty>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is NarrowToActual<Actual, Empty> {
    const input = actual;

    if (!input) {
        return;
    } else if (typeof input !== 'string' && typeof input !== 'object') {
        throw new TypeError(`Cannot check if '${stringify(input)}' is empty.`);
    } else if (
        (typeof input === 'string' && input) ||
        (Array.isArray(input) && input.length) ||
        (input instanceof Map && input.size) ||
        (input instanceof Set && input.size) ||
        (input && typeof input === 'object' && Object.keys(input).length)
    ) {
        throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
    }
}
function isNotEmpty<const Actual extends CanBeEmpty>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, Empty> {
    try {
        isEmpty(actual);
    } catch {
        return;
    }

    throw new AssertionError(`'${stringify(actual)}' is empty.`, failureMessage);
}

const assertions: {
    /**
     * Check if an object/array includes the given value through reference equality.
     *
     * Performs no type guarding.
     */
    hasValue: typeof hasValue;
    /**
     * Check if an object/array does _not_ include the given value through reference equality.
     *
     * Performs no type guarding.
     */
    lacksValue: typeof lacksValue;
    /**
     * Check if an object/array includes the given values through reference equality.
     *
     * Performs no type guarding.
     */
    hasValues: typeof hasValues;
    /**
     * Check if an object/array does _not_ include the given values through reference equality.
     *
     * Performs no type guarding.
     */
    lacksValues: typeof lacksValues;
    /**
     * Check if a child value is contained within a parent object, array, or string.
     *
     * Type guards the child when possible.
     */
    isIn: typeof isIn;
    /**
     * Check if a child value is _not_ contained within a parent object, array, or string.
     *
     * Type guards the child when possible.
     */
    isNotIn: typeof isNotIn;
    /**
     * Check if a value is empty.
     *
     * Type guards the value.
     */
    isEmpty: typeof isEmpty;
    /**
     * Check if a value is not empty.
     *
     * Type guards the value.
     */
    isNotEmpty: typeof isNotEmpty;
} = {
    hasValue,
    lacksValue,
    hasValues,
    lacksValues,
    isIn,
    isNotIn,
    isEmpty,
    isNotEmpty,
};

export const valueGuards = {
    assertions,
    checkOverrides: {
        isIn: autoGuard<
            <const Parent>(child: unknown, parent: Parent) => child is Values<Parent>
        >(),
        isNotIn:
            autoGuard<
                <const Parent, const Child>(
                    child: Child,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => child is Exclude<Child, Values<Parent>>
            >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => actual is NarrowToActual<Actual, Empty>
            >(),
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => actual is Exclude<Actual, Empty>
            >(),
    },
    assertWrapOverrides: {
        isIn: autoGuard<
            <const Child, const Parent>(
                child: Child,
                parent: Parent,
                failureMessage?: string | undefined,
            ) => NarrowToExpected<Child, Values<Parent>>
        >(),
        isNotIn:
            autoGuard<
                <const Parent, const Child>(
                    child: Child,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Child, Values<Parent>>
            >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToActual<Actual, Empty>
            >(),
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(actual: Actual) => Exclude<Actual, Empty>
            >(),
    },
    checkWrapOverrides: {
        isIn: autoGuard<
            <const Child, const Parent>(
                child: Child,
                parent: Parent,
            ) => NarrowToExpected<Child, Values<Parent>> | undefined
        >(),
        isNotIn:
            autoGuard<
                <const Parent, const Child>(
                    child: Child,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Child, Values<Parent>> | undefined
            >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => NarrowToActual<Actual, Empty> | undefined
            >(),
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => Exclude<Actual, Empty> | undefined
            >(),
    },
    waitUntilOverrides: {
        isIn: autoGuard<
            <const Child, const Parent>(
                parent: Parent,
                callback: () => MaybePromise<Child>,
                options?: WaitUntilOptions | undefined,
                failureMessage?: string | undefined,
            ) => Promise<NarrowToExpected<Child, Values<Parent>>>
        >(),
        isNotIn:
            autoGuard<
                <const Child, const Parent>(
                    parent: Parent,
                    callback: () => MaybePromise<Child>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Child, Values<Parent>>>
            >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToActual<Actual, Empty>>
            >(),
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, Empty>>
            >(),
    },
};
