/**
 * Get a string's length in bytes.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {getStringByteLength} from '@augment-vir/common';
 *
 * const results = getStringByteLength('hello 🌍'); // 10
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getByteLength(value: string) {
    const byteLength = new TextEncoder().encode(value).length;
    return byteLength;
}
