import {EnumBaseType, getEnumValues} from './enum-values.js';

export function isEnumValue<const T extends EnumBaseType>(
    value: unknown,
    checkEnum: T,
): value is T[keyof T] {
    try {
        assertEnumValue(value, checkEnum);
        return true;
    } catch {
        return false;
    }
}

export function assertEnumValue<const T extends EnumBaseType>(
    value: unknown,
    checkEnum: T,
): asserts value is T[keyof T] {
    if (!getEnumValues(checkEnum).includes(value as T[keyof T])) {
        throw new TypeError(`${String(value)} is not an enum value.`);
    }
}

/** Interpret a string as an enum value with type safety. */
export function ensureEnumValue<const T extends EnumBaseType>(
    value: unknown,
    checkEnum: T,
): T[keyof T] {
    assertEnumValue(value, checkEnum);
    return value;
}

export function filterToEnumValues<const T extends EnumBaseType>(
    inputs: ReadonlyArray<unknown>,
    checkEnum: T,
): T[keyof T][] {
    return inputs.filter((input) => isEnumValue(input, checkEnum));
}
