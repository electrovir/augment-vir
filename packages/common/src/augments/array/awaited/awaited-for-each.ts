import {awaitedBlockingMap} from './awaited-map.js';

/**
 * Performs
 * [`[].forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
 * on an array but supports an async callback. The async callback is blocking. Meaning,
 * `awaitedForEach` will wait for a callback on array element 1 to finish before moving on to array
 * element 2.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {awaitedForEach} from '@augment-vir/common';
 *
 * await awaitedForEach(
 *     [
 *         1,
 *         2,
 *         3,
 *         4,
 *         5,
 *     ],
 *     async (value) => {
 *         await Promise.resolve(value);
 *     },
 * );
 * ```
 *
 * @package @augment-vir/common
 */
export async function awaitedForEach<OriginalGeneric>(
    input: ReadonlyArray<OriginalGeneric>,
    callback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => void | PromiseLike<void>,
): Promise<void> {
    await awaitedBlockingMap<OriginalGeneric, void | PromiseLike<void>>(input, callback);
}
