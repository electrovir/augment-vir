import {awaitedBlockingMap} from './awaited-map.js';

/**
 * Performs
 * [`[].filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 * on an array but supports an async callback.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {awaitedFilter} from '@augment-vir/common';
 *
 * const result = await awaitedFilter(
 *     [
 *         1,
 *         2,
 *         3,
 *         4,
 *         5,
 *     ],
 *     async (value) => {
 *         return await Promise.resolve(value > 2);
 *     },
 * );
 * ```
 *
 * @returns A new array (does not mutate).
 * @package @augment-vir/common
 */
export async function awaitedFilter<OriginalGeneric>(
    arrayInput: ReadonlyArray<OriginalGeneric>,
    filterCallback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => Promise<unknown>,
    options?: {
        /**
         * Each call to the filter callback is blocking, meaning the next one won't start until the
         * current one finishes. By default this is false.
         */
        blocking?: boolean | undefined;
    },
): Promise<OriginalGeneric[]> {
    const callbackResults: unknown[] = options?.blocking
        ? await awaitedBlockingMap(arrayInput, filterCallback)
        : await Promise.all(arrayInput.map(filterCallback));

    return arrayInput.filter((originalValue, index) => !!callbackResults[index]);
}
