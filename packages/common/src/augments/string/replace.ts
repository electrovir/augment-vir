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
 * replaceStringAtIndex({original: 'eat the waffles', start: 4, replacement: 'his'}); // outputs `'eat his waffles'`
 * replaceStringAtIndex({original: 'eat the waffles', start: 4, replacement: 'my', length: 3}); // outputs `'eat my waffles'`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function replaceStringAtIndex({
    original,
    start,
    replacement,
    length = replacement.length,
}: Readonly<{
    original: string;
    start: number;
    replacement: string;
    length?: number | undefined;
}>): string {
    const before = original.slice(0, Math.max(0, start));
    const after = original.slice(Math.max(0, start + length));

    return `${before}${replacement}${after}`;
}
