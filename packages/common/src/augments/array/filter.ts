/**
 * Removes all given indexes from the given array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {filterOutIndexes} from '@augment-vir/common';
 *
 * const result = filterOutIndexes(
 *     [
 *         'a',
 *         'b',
 *         '',
 *     ],
 *     [
 *         0,
 *         2,
 *     ],
 * );
 * // result is `['b']`
 * ```
 *
 * @returns A new array (does not mutate).
 * @package @augment-vir/common
 */
export function filterOutIndexes<T>(array: ReadonlyArray<T>, indexes: ReadonlyArray<number>): T[] {
    return array.filter((_, index) => !indexes.includes(index));
}

/** Performs `filterMap` with a type guard filter. */
export function filterMap<ElementType, MappedEntry, TypeGuarded extends MappedEntry>(
    inputArray: ReadonlyArray<ElementType>,
    mapCallback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MappedEntry,
    filterCallback: (
        mappedOutput: MappedEntry,
        originalEntry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => mappedOutput is TypeGuarded,
): TypeGuarded[];
/** Performs a regular `filterMap`. */
export function filterMap<ElementType, MappedEntry>(
    inputArray: ReadonlyArray<ElementType>,
    mapCallback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MappedEntry,
    filterCallback: (
        mappedOutput: MappedEntry,
        originalEntry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => boolean,
): MappedEntry[];
/**
 * Performs
 * [`[].map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
 * and
 * [`[].filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 * (in that order) on an array with a single iteration.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {filterMap} from '@augment-vir/common';
 *
 * const result = filterMap(
 *     [
 *         'a',
 *         'b',
 *         '',
 *     ],
 *     // map callback
 *     (value) => {
 *         return `value-${value}`;
 *     },
 *     // filter callback
 *     (mappedValue, originalValue) => {
 *         return !!originalValue;
 *     },
 * );
 * // result is `['value-a', 'value-b']`
 * ```
 *
 * @package @augment-vir/common
 */
export function filterMap<ElementType, MappedEntry>(
    inputArray: ReadonlyArray<ElementType>,
    mapCallback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MappedEntry,
    filterCallback: (
        mappedOutput: MappedEntry,
        originalEntry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => boolean,
): MappedEntry[] {
    return inputArray.reduce((accum: MappedEntry[], entry, index, originalArray) => {
        const mapOutput = mapCallback(entry, index, originalArray);
        const filterOutput = filterCallback(mapOutput, entry, index, originalArray);
        if (filterOutput) {
            accum.push(mapOutput);
        }
        return accum;
    }, []);
}
