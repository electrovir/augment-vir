import type {ArrayElement} from '@augment-vir/core';
import {Writable} from '../type/writable.js';

/**
 * This type should not be used outside of this file. This is used to match the
 * Array.prototype.map's callback type, which has insufficient type information, to our more
 * strictly typed MapCallbackType.
 */
type LibMapCallbackType<ArrayType extends ReadonlyArray<any>, OutputType> = (
    value: ArrayElement<ArrayType>,
    index: number,
    array: readonly ArrayElement<ArrayType>[],
) => OutputType;

/**
 * Performs
 * [`[].map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
 * on an array but transfers the input tuple's size to the output type.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {typedMap} from '@augment-vir/common';
 *
 * const result = await typedMap(
 *     [
 *         1,
 *         2,
 *         3,
 *         4,
 *         5,
 *     ],
 *     (value) => {
 *         return value + 1;
 *     },
 * );
 * ```
 *
 * @returns A new array (does not mutate).
 * @package @augment-vir/common
 */
export function typedMap<const ArrayGeneric extends ReadonlyArray<any>, const OutputType>(
    arrayToMap: ArrayGeneric,
    mapCallback: (
        value: ArrayElement<NoInfer<ArrayGeneric>>,
        index: number,
        array: NoInfer<ArrayGeneric>,
    ) => OutputType,
): Writable<{[Index in keyof ArrayGeneric]: OutputType}> {
    return arrayToMap.map(mapCallback as LibMapCallbackType<ArrayGeneric, OutputType>) as Writable<{
        [Index in keyof ArrayGeneric]: OutputType;
    }>;
}
