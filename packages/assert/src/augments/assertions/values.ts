import type {AnyObject, Values} from '@augment-vir/core';
import JSON5 from 'json5';
import type {EmptyObject} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import {combineFailureMessage} from '../guard-types/combine-failure-message.js';
import {autoGuard} from '../guard-types/guard-override.js';
import type {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import type {NarrowToActual, NarrowToExpected} from './narrow-type.js';

/** Check if an object has the given value through reference equality. */
function hasValue<const Parent>(
    parent: Parent,
    value: unknown,
    failureMessage?: string | undefined,
) {
    const message = combineFailureMessage(
        `'${JSON5.stringify(parent)}' does not have value '${JSON5.stringify(value)}'.`,
        failureMessage,
    );
    if (!parent) {
        throw new AssertionError(message);
    }
    const hasValue = Reflect.ownKeys(parent)
        .map((key) => parent[key as keyof Parent] as unknown)
        .includes(value);

    if (!hasValue) {
        throw new AssertionError(message);
    }
}

/** Check if an object has the given value through reference equality. */
function hasValues<const Parent>(
    parent: Parent,
    values: ReadonlyArray<unknown>,
    failureMessage?: string | undefined,
) {
    values.forEach((value) => hasValue(parent, value, failureMessage));
}

function isIn<const Parent>(
    child: unknown,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Values<Parent> {
    hasValue(parent, child, failureMessage);
}

export type CanBeEmpty = string | Map<any, any> | Set<any> | AnyObject | any[];
export type Empty = '' | EmptyObject | [] | Map<any, any> | Set<any>;

function isEmpty<const Actual extends CanBeEmpty>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is NarrowToActual<Actual, Empty> {
    const input = actual;

    if (
        !input ||
        (typeof input !== 'string' &&
            typeof input !== 'object' &&
            !(input instanceof Map) &&
            !(input instanceof Set))
    ) {
        throw new TypeError(`Cannot check if '${JSON5.stringify(input)}' is empty.`);
    } else if (
        (typeof input === 'string' && input) ||
        (Array.isArray(input) && input.length) ||
        (input instanceof Map && input.size) ||
        (input instanceof Set && input.size) ||
        (input && typeof input === 'object' && Object.keys(input).length)
    ) {
        throw new AssertionError(
            failureMessage || `Expected '${JSON5.stringify(actual)}' to be empty.`,
        );
    }
}

const assertions: {
    hasValue: typeof hasValue;
    hasValues: typeof hasValues;
    isIn: typeof isIn;
    isEmpty: typeof isEmpty;
} = {
    hasValue,
    hasValues,
    isIn,
    isEmpty,
};

export const valueGuards = {
    assertions,
    checkOverrides: {
        isIn: autoGuard<
            <const Parent>(child: unknown, parent: Parent) => child is Values<Parent>
        >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => actual is NarrowToActual<Actual, Empty>
            >(),
    },
    assertWrapOverrides: {
        isIn: autoGuard<
            <const Actual, const Parent>(
                child: Actual,
                parent: Parent,
                failureMessage?: string | undefined,
            ) => NarrowToExpected<Actual, Values<Parent>>
        >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToActual<Actual, Empty>
            >(),
    },
    checkWrapOverrides: {
        isIn: autoGuard<
            <const Actual, const Parent>(
                child: Actual,
                parent: Parent,
            ) => NarrowToExpected<Actual, Values<Parent>> | undefined
        >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => NarrowToActual<Actual, Empty> | undefined
            >(),
    },
    waitUntilOverrides: {
        isIn: autoGuard<
            <const Actual, const Parent>(
                parent: Parent,
                callback: () => Actual,
                options?: WaitUntilOptions | undefined,
                failureMessage?: string | undefined,
            ) => Promise<NarrowToExpected<Actual, Values<Parent>>>
        >(),
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    callback: () => Actual,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToActual<Actual, Empty>>
            >(),
    },
};
