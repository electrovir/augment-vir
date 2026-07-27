import {type RequireExactlyOne} from '@augment-vir/core';

/**
 * Options for {@link getArrayPage}.
 *
 * @category Internal
 */
export type ArrayPaginationOptions = {
    /** Split the array into pages of this size. */
    countPerPage: number;
    /** Get this page number. This is 0 indexed. */
    getPage: number;
};

/**
 * Split an array into pages of size `countPerPage` and then get the `getPage` page from that split.
 * `getPage` is `0` indexed.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {getArrayPage} from '@augment-vir/common';
 *
 * const result = getArrayPage(
 *     [
 *         'a',
 *         'b',
 *         'c',
 *     ],
 *     {
 *         countPerPage: 2,
 *         getPage: 1,
 *     },
 * );
 * // result is `['c']`
 * ```
 */
export function getArrayPage<ArrayEntry>(
    originalArray: ReadonlyArray<ArrayEntry>,
    options: Readonly<ArrayPaginationOptions>,
): ArrayEntry[] | undefined {
    const chunks = chunkArray(originalArray, {
        chunkSize: options.countPerPage,
    });

    return chunks[options.getPage];
}

/**
 * Options for {@link chunkArray}. Only set one property (`chunkCount` or `chunkSize`). If the value
 * given is `0`, the array will not be chunked at all.
 *
 * @category Internal
 */
export type ChunkArrayOptions = RequireExactlyOne<{
    /** Split the array into this many chunks. */
    chunkCount: number;
    /** Split the array into chunks of this size. */
    chunkSize: number;
}>;

/**
 * Split an array into multiple sub array "chunks" based on the given options.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {chunkArray} from '@augment-vir/common';
 *
 * const result = chunkArray(
 *     [
 *         'a',
 *         'b',
 *         'c',
 *     ],
 *     {
 *         chunkSize: 2,
 *     },
 * );
 * // result is `[['a', 'b'], ['c']]`
 * ```
 */
export function chunkArray<ArrayEntry>(
    originalArray: ReadonlyArray<ArrayEntry>,
    options: Readonly<ChunkArrayOptions>,
): ArrayEntry[][] {
    const chunkSize =
        options.chunkSize ||
        (options.chunkCount ? Math.ceil(originalArray.length / options.chunkCount) : 0);

    if (!chunkSize) {
        return [[...originalArray]];
    }
    const chunkedArray: ArrayEntry[][] = [];

    for (let i = 0; i < originalArray.length; i += chunkSize) {
        chunkedArray.push(originalArray.slice(i, i + chunkSize));
    }

    return chunkedArray;
}
