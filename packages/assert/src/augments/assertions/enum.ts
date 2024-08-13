import {getEnumValues, type EnumBaseType} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import type {NarrowToExpected} from './narrow-type.js';

export function isEnumValue<const Expected extends EnumBaseType>(
    value: unknown,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts value is Expected[keyof Expected] {
    if (!getEnumValues(checkEnum).includes(value as Expected[keyof Expected])) {
        throw new AssertionError(failureMessage || `${String(value)} is not an enum value.`);
    }
}

const assertions: {
    isEnumValue: typeof isEnumValue;
} = {
    isEnumValue,
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
    },
    checkWrapOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    value: Actual,
                    checkEnum: Expected,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]> | undefined
            >(),
    },
    waitUntilOverrides: {
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    checkEnum: Expected,
                    callback: () => Actual,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected[keyof Expected]>>
            >(),
    },
} satisfies GuardGroup;
