import {getOrSet} from '../object/get-or-set.js';
import {typedObjectFromEntries} from '../object/object-entries.js';

/**
 * Polyfill for `Object.groupBy`:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
 *
 * @category Array : Common
 * @category Object : Common
 * @example
 *
 * ```ts
 * import {arrayToObject} from '@augment-vir/common';
 *
 * const result = arrayToObject(
 *     [
 *         'a',
 *         'b',
 *     ],
 *     (value) => `key-${value}`,
 * );
 * // result is `{key-a: ['a'], key-b: ['b']}`
 * ```
 */
export function groupArrayBy<ElementType, NewKey extends PropertyKey>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        value: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => NewKey,
): Partial<Record<NewKey, ElementType[]>> {
    return inputArray.reduce(
        (accum, entry, index, originalArray) => {
            const key = callback(entry, index, originalArray);
            const entryArray: ElementType[] = getOrSet(accum, key, () => [] as ElementType[]);

            entryArray.push(entry);

            return accum;
        },
        {} as Record<NewKey, ElementType[]>,
    ) as Partial<Record<NewKey, ElementType[]>>;
}

/**
 * Similar to {@link groupArrayBy} but maps array entries to a single key and requires `key` _and_
 * `value` outputs from the callback. The resulting object does not have an array of elements
 * (unless the original array itself contains arrays).
 *
 * @category Array : Common
 * @category Object : Common
 * @example
 *
 * ```ts
 * import {arrayToObject} from '@augment-vir/common';
 *
 * const result = arrayToObject(
 *     [
 *         'a',
 *         'b',
 *     ],
 *     (value) => {
 *         return {key: `key-${value}`, value};
 *     },
 * );
 * // result is `{key-a: 'a', key-b: 'b'}`
 * ```
 * @package @augment-vir/common
 */
export function arrayToObject<ElementType, NewKey extends PropertyKey, NewValue>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        value: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => {
        key: NewKey;
        value: NewValue;
    },
): Partial<Record<NewKey, NewValue>> {
    return typedObjectFromEntries(
        inputArray.map((entry, index, originalArray) => {
            const {key, value} = callback(entry, index, originalArray);
            return [
                key,
                value,
            ];
        }),
    );
}
