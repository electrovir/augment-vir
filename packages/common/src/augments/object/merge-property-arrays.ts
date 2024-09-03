import {getOrSet} from './get-or-set.js';

/**
 * Merges all arrays by their property in the given objects.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {mergePropertyArrays} from '@augment-vir/common';
 *
 * mergePropertyArrays(
 *     {
 *         a: [
 *             'a',
 *             'b',
 *         ],
 *     },
 *     {
 *         a: [
 *             'c',
 *             'd',
 *         ],
 *     },
 * ); // output is `{a: ['a', 'b', 'c', 'd']}`
 * ```
 *
 * @package @augment-vir/common
 */
export function mergePropertyArrays<T extends Record<PropertyKey, unknown[]>>(
    ...inputs: ReadonlyArray<Readonly<T>>
): T {
    const combined: Record<PropertyKey, unknown[]> = {};

    inputs.forEach((input) => {
        Object.entries(input).forEach(
            ([
                key,
                newArray,
            ]) => {
                const currentArray = getOrSet(combined, key, () => []);
                currentArray.push(...newArray);
            },
        );
    });

    return combined as T;
}
