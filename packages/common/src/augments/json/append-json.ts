import {check} from '@augment-vir/assert';
import {copyThroughJson} from './copy-through-json.js';
import type {
    JsonCompatibleArray,
    JsonCompatibleObject,
    JsonCompatibleValue,
} from './json-compatible.js';
import {JsonCompatiblePrimitive} from './json-compatible.js';

export function appendJson(
    entry: JsonCompatibleArray | JsonCompatiblePrimitive,
    ...entries: ReadonlyArray<JsonCompatibleValue | undefined>
): JsonCompatibleArray;
export function appendJson(
    entry: JsonCompatibleObject,
    ...entries: ReadonlyArray<JsonCompatibleObject | JsonCompatibleArray | undefined>
): JsonCompatibleObject;
export function appendJson(
    ...entries: ReadonlyArray<JsonCompatibleValue | undefined>
): JsonCompatibleObject | JsonCompatibleArray;
/**
 * Appends all provided JSON values together. `undefined` values will be ignored. The first value
 * determines whether the output will be an object or an array. Any value appended to an array will
 * work just fine, but primitives append to an object will likely behave unexpectedly. Arrays
 * appended to arrays will be flattened (but only by one level).
 *
 * @category JSON : Common
 * @example
 *
 * ```ts
 * import {appendJson} from '@augment-vir/common';
 *
 * // `result1` will be `{a: 'q', b: 'b'}`
 * const result1 = appendJson({a: 'a'}, {b: 'b'}, {a: 'q'});
 * // `result2` will be `[{a: 'a'}, {b: 'b'}, {a: 'q'}, 'r']`
 * const result2 = appendJson([{a: 'a'}], {b: 'b'}, {a: 'q'}, 'r');
 * // `result3` will be `['a', ['b', 'c'], 'd', 'e']`
 * const result3 = appendJson(
 *     ['a'],
 *     [
 *         [
 *             'b',
 *             'c',
 *         ],
 *     ],
 *     ['d'],
 *     'e',
 * );
 * ```
 *
 * @package @augment-vir/common
 */
export function appendJson(
    ...rawEntries: ReadonlyArray<
        JsonCompatibleObject | JsonCompatibleArray | JsonCompatibleValue | undefined
    >
): JsonCompatibleObject | JsonCompatibleArray {
    const entries: ReadonlyArray<JsonCompatibleObject | JsonCompatibleArray | JsonCompatibleValue> =
        rawEntries.filter(check.isTruthy);

    if (!check.isLengthAtLeast(entries, 1)) {
        return {};
    }

    const firstEntry = copyThroughJson(entries[0]);

    const combinedData: JsonCompatibleObject | JsonCompatibleArray =
        typeof firstEntry === 'object'
            ? (firstEntry as JsonCompatibleObject | JsonCompatibleArray)
            : [firstEntry];

    entries.slice(1).forEach((entry) => {
        if (check.isArray(combinedData)) {
            if (check.isArray(entry)) {
                combinedData.push(...entry);
            } else {
                combinedData.push(entry);
            }
        } else {
            Object.assign(combinedData, entry);
        }
    });

    return combinedData;
}
