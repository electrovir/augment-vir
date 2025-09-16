import {type AnyObject, type ArrayElement} from '@augment-vir/core';

/**
 * Creates the cartesian product (cross product) of an object whose values are arrays. The result is
 * an array of objects where each object contains one picked value from every input array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {crossProduct} from '@augment-vir/common';
 *
 * const result = crossProduct({
 *     a: [
 *         1,
 *         2,
 *         3,
 *     ],
 *     b: [
 *         'a',
 *         'b',
 *         'c',
 *     ],
 * });
 * // result is:
 * // [
 * //   {a: 1, b: 'a'}, {a: 2, b: 'a'}, {a: 3, b: 'a'},
 * //   {a: 1, b: 'b'}, {a: 2, b: 'b'}, {a: 3, b: 'b'},
 * //   {a: 1, b: 'c'}, {a: 2, b: 'c'}, {a: 3, b: 'c'},
 * // ]
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function crossProduct<const OriginalValues extends Record<PropertyKey, ReadonlyArray<any>>>(
    originalValues: OriginalValues,
): {[Key in keyof OriginalValues]: ArrayElement<OriginalValues[Key]>}[] {
    return Object.entries(originalValues)
        .reverse()
        .filter(
            ([
                ,
                values,
            ]) => values.length,
        )
        .reduce(
            (
                accum,
                [
                    key,
                    values,
                ],
            ) => {
                if (!accum.length) {
                    accum = [{}];
                }

                return values.flatMap((value) => {
                    return accum.map((partial) => {
                        return {
                            ...partial,
                            [key]: value,
                        };
                    });
                });
            },
            [] as AnyObject[],
        ) as {[Key in keyof OriginalValues]: ArrayElement<OriginalValues[Key]>}[];
}
