/**
 * Repeats an array. Constructs a new array with the entries from the original repeated the given
 * number of times.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {repeatArray} from '@augment-vir/common';
 *
 * const result = repeatArray(3, [
 *     'a',
 *     'b',
 *     'c',
 * ]);
 * // result is `['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c']`
 * ```
 *
 * @returns A new array (does not mutate).
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function repeatArray<T>(repeatCount: number, array: T[]): T[] {
    return Array.from({length: repeatCount}, () => [...array]).flat();
}
