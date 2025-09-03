import {type MaybePromise} from '@augment-vir/core';

/**
 * Performs
 * [`[].find()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
 * on an array but supports an async callback. The async callback is blocking. Meaning,
 * `awaitedFind` will wait for a callback on array element 1 to finish before moving on to array
 * element 2.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {awaitedFind} from '@augment-vir/common';
 *
 * await awaitedFind(
 *     [
 *         1,
 *         2,
 *         3,
 *         4,
 *         5,
 *     ],
 *     async (value) => {
 *         await Promise.resolve(value > 2);
 *     },
 * );
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export async function awaitedFind<const T>(
    array: ReadonlyArray<T>,
    callback: (item: T, index: number, originalArray: ReadonlyArray<T>) => MaybePromise<boolean>,
): Promise<T | undefined> {
    for (let index = 0; index < array.length; index++) {
        const item = array[index] as T;
        if (await callback(item, index, array)) {
            return item;
        }
    }

    return undefined;
}
