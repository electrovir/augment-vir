import {removeDuplicates} from '../array/remove-duplicates.js';

/**
 * Removes duplicate characters from any number of strings.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {removeDuplicateCharacters} from '@augment-vir/common';
 *
 * removeDuplicateCharacters('aAaBc', 'QrsAa');
 * // output is `'aABcQrs'`
 * ```
 *
 * @package @augment-vir/common
 */
export function removeDuplicateCharacters(...values: ReadonlyArray<string>): string {
    const combined = values.join('');
    const deDuped = removeDuplicates(Array.from(combined));

    return Array.from(deDuped).join('');
}
