import {getObjectTypedKeys} from '../object/object-keys.js';
import type {EnumBaseType} from './enum-type.js';

/** Don't export this because it's useless except for being used in {@link getEnumValues}. */
function getEnumKeys<T extends EnumBaseType>(input: T): (keyof T)[] {
    // enum keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key)));
}

/**
 * Gets all values within an enum as an array.
 *
 * @category Enum
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getEnumValues<T extends EnumBaseType>(input: T): T[keyof T][] {
    const keys = getEnumKeys(input);
    return keys.map((key) => input[key]);
}
