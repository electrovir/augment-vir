import {ensureErrorAndPrependMessage, type JsonCompatibleValue} from '@augment-vir/core';
import {type IsUnknown, type Jsonify, type Writable} from 'type-fest';
import {safeJsonStringify} from './safe-json-stringify.js';

/**
 * Deeply copy an object through JSON. This is the fastest deep copy, but the input must already be
 * JSON serializable otherwise the copy will not match the original.
 *
 * @category JSON : Common
 * @category Copy
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {copyThroughJson} from '@augment-vir/common';
 *
 * // `copy1` will be `{a: 'a', b: 'b'}`
 * const copy1 = copyThroughJson({a: 'a', b: 'b'});
 * // `copy2` will be `{map: {}, b: 'b'}`
 * const copy2 = copyThroughJson({
 *     map: new Map([
 *         [
 *             'q',
 *             'r',
 *         ],
 *         [
 *             's',
 *             't',
 *         ],
 *     ]),
 *     b: 'b',
 * });
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function copyThroughJson<const T>(
    input: T,
): IsUnknown<T> extends true ? JsonCompatibleValue : Writable<Jsonify<T>> {
    try {
        return JSON.parse(JSON.stringify(input));
        /* node:coverage ignore next 4 */
    } catch (error) {
        console.error('Failed to JSON copy for:', input);
        throw ensureErrorAndPrependMessage(error, 'Failed JSON copy');
    }
}

/**
 * Same as {@link copyThroughJson} but this uses safe serialization from {@link safeJsonStringify}.
 *
 * @category JSON : Common
 * @category Copy
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function safeCopyThroughJson<const T>(
    input: T,
): IsUnknown<T> extends true ? JsonCompatibleValue : Writable<Jsonify<T>> {
    try {
        return JSON.parse(safeJsonStringify(input));
        /* node:coverage ignore next 4 */
    } catch (error) {
        console.error('Failed to JSON copy for:', input);
        throw ensureErrorAndPrependMessage(error, 'Failed JSON copy');
    }
}
