import {EnumBaseType, getEnumValues, MaybePromise} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import type {NarrowToExpected} from './narrow-type.js';

function isEnumValue<const Expected extends EnumBaseType>(
    value: unknown,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts value is Expected[keyof Expected] {
    const values = getEnumValues(checkEnum);
    if (!values.includes(value as Expected[keyof Expected])) {
        throw new AssertionError(
            failureMessage || `${String(value)} is not an enum value in '${values.join(',')}'.`,
        );
    }
}
function isNotEnumValue<const Actual, const Expected extends EnumBaseType>(
    value: Actual,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts value is Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`> {
    try {
        isEnumValue(value, checkEnum);
    } catch {
        return;
    }

    const values = getEnumValues(checkEnum);
    throw new AssertionError(
        failureMessage || `${String(value)} is an enum value in '${values.join(',')}'`,
    );
}

const assertions: {
    isEnumValue: typeof isEnumValue;
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
                    value: unknown,
                    checkEnum: Expected,
                ) => value is Expected[keyof Expected]
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    value: Actual,
                    checkEnum: Expected,
                ) => value is Exclude<
                    Actual,
                    Expected[keyof Expected] | `${Expected[keyof Expected]}`
                >
            >(),
    },
    assertWrapOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    value: Actual,
                    checkEnum: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]>
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    value: Actual,
                    checkEnum: Expected,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
            >(),
    },
    checkWrapOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    value: Actual,
                    checkEnum: Expected,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]> | undefined
            >(),
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    value: Actual,
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
