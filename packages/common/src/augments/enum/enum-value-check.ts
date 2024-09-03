import {check} from '@augment-vir/assert';
import type {EnumBaseType} from '@augment-vir/core';

/**
 * Filters the input array to all valid values from the given enum.
 *
 * @category Array
 * @category Enum
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * enum MyEnum {
 *     A = 'a',
 *     B = 'b',
 * }
 *
 * const result = filterToEnumValues(
 *     [
 *         1,
 *         2,
 *         3,
 *         'a',
 *         'b',
 *         MyEnum.A,
 *     ],
 *     MyEnum,
 * ); // result is `[MyEnum.A, MyEnum.B, MyEnum.A]`
 * ```
 *
 * @returns A new array (does not mutate).
 * @package @augment-vir/common
 */
export function filterToEnumValues<const T extends EnumBaseType>(
    inputs: ReadonlyArray<unknown>,
    checkEnum: T,
): T[keyof T][] {
    return inputs.filter((input) => check.isEnumValue(input, checkEnum));
}
