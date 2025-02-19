/**
 * Performs
 * [`[].map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
 * on an array but supports an async callback. The async callback is blocking. Meaning,
 * `awaitedForEach` will wait for a callback on array element 1 to finish before moving on to array
 * element 2. Compare to `await Promise.all([].map(async () => {}))` which is _not_ blocking (all
 * callbacks are called in parallel).
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {awaitedBlockingMap} from '@augment-vir/common';
 *
 * const result = await awaitedBlockingMap(
 *     [
 *         1,
 *         2,
 *         3,
 *         4,
 *         5,
 *     ],
 *     async (value) => {
 *         return await Promise.resolve(value);
 *     },
 * );
 * ```
 *
 * @returns A new array (does not mutate).
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export async function awaitedBlockingMap<OriginalGeneric, MappedGeneric>(
    input: ReadonlyArray<OriginalGeneric>,
    callback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => MappedGeneric | PromiseLike<MappedGeneric>,
): Promise<Awaited<MappedGeneric>[]> {
    return await input.reduce(
        async (
            accumPromise: Promise<Awaited<MappedGeneric>[]>,
            currentElement,
            index,
            wholeArray,
        ) => {
            const accum = await accumPromise;
            const mappedValue = await callback(currentElement, index, wholeArray);
            accum.push(mappedValue);
            return accum;
        },
        Promise.resolve([]),
    );
}
