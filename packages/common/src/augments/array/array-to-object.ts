import {check} from '@augment-vir/assert';
import {type MaybePromise, ensureError} from '@augment-vir/core';
import {getOrSet} from '../object/get-or-set.js';
import {typedObjectFromEntries} from '../object/object-entries.js';
import {filterMap} from './filter.js';

/**
 * Polyfill for `Object.groupBy`:
 * https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
 *
 * @category Array
 * @category Object
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

export function arrayToObject<ElementType, NewKey extends PropertyKey, NewValue>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        value: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => Promise<
        | {
              key: NewKey;
              value: NewValue;
          }
        | undefined
    >,
): Promise<Partial<Record<NewKey, NewValue>>>;
export function arrayToObject<ElementType, NewKey extends PropertyKey, NewValue>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        value: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) =>
        | {
              key: NewKey;
              value: NewValue;
          }
        | undefined,
): Partial<Record<NewKey, NewValue>>;
export function arrayToObject<ElementType, NewKey extends PropertyKey, NewValue>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        value: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MaybePromise<
        | {
              key: NewKey;
              value: NewValue;
          }
        | undefined
    >,
): MaybePromise<Partial<Record<NewKey, NewValue>>>;
/**
 * Similar to {@link groupArrayBy} but maps array entries to a single key and requires `key` _and_
 * `value` outputs from the callback. The resulting object does not have an array of elements
 * (unless the original array itself contains arrays). Automatically handles the case where the
 * callback returns a promise.
 *
 * @category Array
 * @category Object
 * @category Package : @augment-vir/common
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
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function arrayToObject<ElementType, NewKey extends PropertyKey, NewValue>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        value: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MaybePromise<
        | {
              key: NewKey;
              value: NewValue;
          }
        | undefined
    >,
): MaybePromise<Partial<Record<NewKey, NewValue>>> {
    try {
        let gotAPromise = false as boolean;

        const mappedEntries = inputArray
            .map((entry, index, originalArray) => {
                const output = callback(entry, index, originalArray);
                if (output instanceof Promise) {
                    gotAPromise = true;
                    return output;
                } else if (output) {
                    return [
                        output.key,
                        output.value,
                    ] as [NewKey, NewValue];
                } else {
                    return undefined;
                }
            })
            .filter(check.isTruthy);

        if (gotAPromise) {
            return new Promise<Record<NewKey, NewValue>>(async (resolve, reject) => {
                try {
                    const entries: [NewKey, NewValue][] = filterMap(
                        await Promise.all(mappedEntries),
                        (entry) => {
                            if (!entry) {
                                return undefined;
                            } else if (Array.isArray(entry)) {
                                return entry;
                            } else {
                                return [
                                    entry.key,
                                    entry.value,
                                ] as [NewKey, NewValue];
                            }
                        },
                        check.isTruthy,
                    );

                    resolve(typedObjectFromEntries(entries));
                } catch (error) {
                    reject(ensureError(error));
                }
            });
        } else {
            return typedObjectFromEntries(mappedEntries as [NewKey, NewValue][]);
        }
    } catch (error) {
        throw ensureError(error);
    }
}
