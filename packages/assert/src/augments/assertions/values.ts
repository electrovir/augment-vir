import {AnyObject, MaybePromise, Values} from '@augment-vir/core';
import JSON5 from 'json5';
import type {EmptyObject} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import {autoGuard} from '../guard-types/guard-override.js';
import type {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import type {NarrowToActual, NarrowToExpected} from './narrow-type.js';

export type ValueParentBase = object | string;

/** Check if an object has the given value through reference equality. */
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
            `'${JSON5.stringify(parent)}' does not have value '${JSON5.stringify(value)}'.`,
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
        `'${JSON5.stringify(parent)}' has value '${JSON5.stringify(value)}'.`,
        failureMessage,
    );
}

/** Check if an object has the given value through reference equality. */
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

function isIn<const Parent extends ValueParentBase>(
    child: unknown,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Values<Parent> {
    if (typeof parent === 'string') {
        if (!parent.includes(child as string)) {
            throw new AssertionError(
                `${JSON5.stringify(child)} is not in '${parent}'.`,
                failureMessage,
            );
        }
    } else {
        hasValue(parent, child, failureMessage);
    }
}
function isNotIn<const Parent extends ValueParentBase, const Child>(
    child: Child,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Exclude<Child, Values<Parent>> {
    try {
        isIn(child, parent);
    } catch {
        return;
    }

    throw new AssertionError(
        `${JSON5.stringify(child)} is not in ${JSON5.stringify(parent)}.`,
        failureMessage,
    );
}

export type CanBeEmpty = string | Map<any, any> | Set<any> | AnyObject | any[];
export type Empty = '' | EmptyObject | [] | Map<any, any> | Set<any>;

function isEmpty<const Actual extends CanBeEmpty>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is NarrowToActual<Actual, Empty> {
    const input = actual;

    if (!input) {
        return;
    } else if (typeof input !== 'string' && typeof input !== 'object') {
        throw new TypeError(`Cannot check if '${JSON5.stringify(input)}' is empty.`);
    } else if (
        (typeof input === 'string' && input) ||
        (Array.isArray(input) && input.length) ||
        (input instanceof Map && input.size) ||
        (input instanceof Set && input.size) ||
        (input && typeof input === 'object' && Object.keys(input).length)
    ) {
        throw new AssertionError(`'${JSON5.stringify(actual)}' is not empty.`, failureMessage);
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

    throw new AssertionError(`'${JSON5.stringify(actual)}' is empty.`, failureMessage);
}

const assertions: {
    hasValue: typeof hasValue;
    lacksValue: typeof lacksValue;
    hasValues: typeof hasValues;
    lacksValues: typeof lacksValues;
    isIn: typeof isIn;
    isNotIn: typeof isNotIn;
    isEmpty: typeof isEmpty;
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
