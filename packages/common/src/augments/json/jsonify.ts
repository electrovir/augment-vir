import JSON5 from 'json5';
import {Jsonify} from 'type-fest';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {copyThroughJson} from './copy-through-json.js';

/**
 * Creates a JSON compatible version of the value given. Under the hood this is actually the same as
 * {@link copyThroughJson}.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {jsonify} from '@augment-vir/common';
 *
 * // `result` is `{b: 'b'}`
 * const result = jsonify({
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
 * @package @augment-vir/common
 */
export function jsonify<T>(value: T): Jsonify<T> {
    return JSON5.parse(JSON5.stringify(value));
}
