/**
 * Replaces whatever substring is at the given index in the original string with the new string.
 * Optionally, provide a length of the substring to get replaced.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {replaceStringAtIndex} from '@augment-vir/common';
 *
 * replaceStringAtIndex('eat the waffles', 4, 'his'); // outputs `'eat his waffles'`
 * replaceStringAtIndex('eat the waffles', 4, 'my', 3); // outputs `'eat my waffles'`
 * ```
 *
 * @package @augment-vir/common
 */
export function replaceStringAtIndex(
    originalString: string,
    start: number,
    newString: string,
    length = newString.length,
): string {
    const before = originalString.slice(0, Math.max(0, start));
    const after = originalString.slice(Math.max(0, start + length));

    return `${before}${newString}${after}`;
}
