/**
 * Removes duplicates from an array. Optionally provide a callback for calculating a unique id for
 * entries.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example No callback
 *
 * ```ts
 * import {removeDuplicates} from '@augment-vir/common';
 *
 * const result = removeDuplicates([
 *     1,
 *     1,
 *     1,
 *     1,
 *     1,
 *     2,
 *     4,
 * ]);
 * // result is `[1, 2, 4]`
 *
 * const exampleEntry = {id: 5};
 *
 * const result2 = removeDuplicates([
 *     {id: 1},
 *     // this entry will not get filtered out because it's a new object reference
 *     {id: 1},
 *     exampleEntry,
 *     // this `exampleEntry` will get filtered out because it's the same reference as the one above
 *     exampleEntry,
 *     {id: 4},
 * ]);
 * // result2 is `[{id: 1}, {id: 1}, exampleEntry, {id: 4}]`
 * ```
 *
 * @example With callback
 *
 * ```ts
 * import {removeDuplicates} from '@augment-vir/common';
 *
 * const exampleEntry = {id: 5};
 *
 * const result2 = removeDuplicates(
 *     [
 *         {id: 1},
 *         {id: 1},
 *         exampleEntry,
 *         exampleEntry,
 *         {id: 4},
 *     ],
 *     (entry) => entry.id,
 * );
 * // result2 is `[{id: 1}, exampleEntry, {id: 4}]`
 * ```
 *
 * @returns A new array (does not mutate).
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function removeDuplicates<const Entry>(
    originalArray: ReadonlyArray<Entry>,
    calculateUniqueId: (entry: Readonly<Entry>) => unknown = (entry) => entry,
): Entry[] {
    const grouped = new Map<unknown, Entry>();

    return originalArray.filter((entry) => {
        const uniqueId = calculateUniqueId(entry);
        if (grouped.get(uniqueId)) {
            return false;
        } else {
            grouped.set(uniqueId, entry);
            return true;
        }
    });
}
