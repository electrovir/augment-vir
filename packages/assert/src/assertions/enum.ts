import type {NarrowToExpected} from '@augment-vir/core';
import {EnumBaseType, getEnumValues, MaybePromise} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

export function isEnumValue<const Expected extends EnumBaseType>(
    child: unknown,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts child is Expected[keyof Expected] {
    const values = getEnumValues(checkEnum);
    if (!values.includes(child as Expected[keyof Expected])) {
        throw new AssertionError(
            `${String(child)} is not an enum value in '${values.join(',')}'.`,
            failureMessage,
        );
    }
}
function isNotEnumValue<const Actual, const Expected extends EnumBaseType>(
    child: Actual,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts child is Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`> {
    try {
        isEnumValue(child, checkEnum);
    } catch {
        return;
    }

    const values = getEnumValues(checkEnum);
    throw new AssertionError(
        `${String(child)} is an enum value in '${values.join(',')}'`,
        failureMessage,
    );
}

const assertions: {
    /**
     * Check if a child value is a valid member of a specific enum.
     *
     * Type guards the child value.
     */
    isEnumValue: typeof isEnumValue;
    /**
     * Check if a child value is _not_ a valid member of a specific enum.
     *
     * Type guards the child value when possible.
     */
    isNotEnumValue: typeof isNotEnumValue;
} = {
    isEnumValue,
    isNotEnumValue,
};

export const enumGuards = {
    assertions,
    checkOverrides: {
        isEnumValue:
            autoGuard<
                <const Expected extends EnumBaseType>(
                    child: unknown,
                    checkEnum: Expected,
                ) => child is Expected[keyof Expected]
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                ) => child is Exclude<
                    Actual,
                    Expected[keyof Expected] | `${Expected[keyof Expected]}`
                >
            >(),
    },
    assertWrapOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]>
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
            >(),
    },
    checkWrapOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]> | undefined
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                ) =>
                    | Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
                    | undefined
            >(),
    },
    waitUntilOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    checkEnum: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected[keyof Expected]>>
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    checkEnum: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<
                    Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
                >
            >(),
    },
} satisfies GuardGroup;
