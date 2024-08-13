import type {EnumBaseType} from '@augment-vir/core';

export function filterToEnumValues<const T extends EnumBaseType>(
    inputs: ReadonlyArray<unknown>,
    checkEnum: T,
): T[keyof T][] {
    return inputs.filter((input) => isEnumValue(input, checkEnum));
}
