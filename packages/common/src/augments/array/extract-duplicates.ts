import {check} from '@augment-vir/assert';

/**
 * Finds all duplicates.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {extractDuplicates} from '@augment-vir/common';
 *
 * const result = extractDuplicates([
 *     'a',
 *     'b',
 *     '',
 *     'a',
 * ]);
 * // result is `{duplicates: ['a'], uniques: ['b', '']}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function extractDuplicates<T>(
    items: ReadonlyArray<T>,
    comparator: (a: T, b: T) => boolean = check.strictEquals,
): {
    duplicates: T[];
    uniques: T[];
} {
    const duplicates = [] as T[];
    const uniques = [] as T[];

    items.forEach((item) => {
        const duplicatesIndex = duplicates.findIndex((duplicateEntry) =>
            comparator(duplicateEntry, item),
        );

        if (duplicatesIndex < 0) {
            const uniquesIndex = uniques.findIndex((uniqueEntry) => comparator(uniqueEntry, item));

            if (uniquesIndex < 0) {
                uniques.push(item);
            } else {
                uniques.splice(uniquesIndex, 1);
                duplicates.push(item);
            }
        }
    });

    return {
        duplicates,
        uniques,
    };
}
