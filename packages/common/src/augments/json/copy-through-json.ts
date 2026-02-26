import {type JsonCompatibleValue, type PartialWithUndefined} from '@augment-vir/core';
import {type IsUnknown, type Jsonify, type Writable} from 'type-fest';
import {safeJsonStringify} from './safe-json-stringify.js';

/**
 * Deeply copy an object through JSON. This is the fastest deep copy, but the input must already be
 * JSON serializable otherwise the copy will not match the original.
 *
 * Note that this will truncate inputs if they are not safe to serialize.
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
    {
        enableUnsafeCopyAll,
    }:
        | Readonly<
              PartialWithUndefined<{
                  enableUnsafeCopyAll: boolean;
              }>
          >
        | undefined = {},
): IsUnknown<T> extends true ? JsonCompatibleValue : Writable<Jsonify<T>> {
    try {
        const stringified = enableUnsafeCopyAll ? JSON.stringify(input) : safeJsonStringify(input);
        return JSON.parse(stringified);
        /* node:coverage ignore next 4 */
    } catch (error) {
        console.error(`Failed to JSON copy for`, input);
        throw error;
    }
}
