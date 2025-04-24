import {check} from '@augment-vir/assert';
import {type Tuple} from '@augment-vir/core';

/**
 * Creates an array of size `size` and calls the given `callback` for each entry in the array and
 * fills the array with the results. The returned array is typed to exactly fit the given size.
 *
 * This function automatically awaits async callbacks.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {createArray} from '@augment-vir/common';
 *
 * const result = createArray(5, (index) => {
 *     return `hi ${index}`;
 * });
 * // result is `['hi 0', 'hi 1', 'hi 2', 'hi 3', 'hi 4']`
 *
 * const asyncResult = await createArray(5, async (index) => {
 *     return Promise.resolve(`hi ${index}`);
 * });
 * // result is `['hi 0', 'hi 1', 'hi 2', 'hi 3', 'hi 4']`
 * ```
 *
 * @returns A new array filled with the results of the given `callback` typed as a Tuple,
 *   automatically wrapping the return type in a `Promise` if the callback returns one.
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function createArray<Size extends number, T>(
    size: Size,
    callback: (index: number) => T,
): Extract<T, Promise<any>> extends never ? Tuple<T, Size> : Promise<Tuple<Awaited<T>, Size>> {
    const array = [];
    let gotPromise = false;

    for (let i = 0; i < size; i++) {
        const result = callback(i);
        if (check.isPromise(result)) {
            gotPromise = true;
        }
        array.push(result);
    }

    return (gotPromise ? Promise.all(array) : array) as Extract<T, Promise<any>> extends never
        ? Tuple<T, Size>
        : Promise<Tuple<Awaited<T>, Size>>;
}
