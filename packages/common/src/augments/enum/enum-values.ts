import {getObjectTypedKeys} from '../object/object-keys.js';

export type EnumBaseType = Record<string, number | string>;

/** Don't export this because it's useless except for being used in {@link getEnumValues}. */
function getEnumKeys<T extends EnumBaseType>(input: T): (keyof T)[] {
    // enum keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key)));
}

export function getEnumValues<T extends EnumBaseType>(input: T): T[keyof T][] {
    const keys = getEnumKeys(input);
    return keys.map((key) => input[key]);
}
