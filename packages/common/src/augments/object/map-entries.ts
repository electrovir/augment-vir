import {check} from '@augment-vir/assert';
import {Values, ensureError, type MaybePromise} from '@augment-vir/core';
import {filterMap} from '../array/filter.js';
import {getObjectTypedEntries, typedObjectFromEntries} from './object-entries.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {mapObjectValues} from './map-values.js';

export function mapObject<const OriginalObject, const NewKey extends PropertyKey, const NewValue>(
    inputObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => Promise<{key: NewKey; value: NewValue} | undefined>,
): Promise<Record<NewKey, NewValue>>;
export function mapObject<const OriginalObject, const NewKey extends PropertyKey, const NewValue>(
    inputObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => {key: NewKey; value: NewValue} | undefined,
): Record<NewKey, NewValue>;
export function mapObject<const OriginalObject, const NewKey extends PropertyKey, const NewValue>(
    inputObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => MaybePromise<{key: NewKey; value: NewValue} | undefined>,
): MaybePromise<Record<NewKey, NewValue>>;
/**
 * Maps an object. The callback must return a key and value.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {mapObject} from '@augment-vir/common';
 *
 * mapObject({a: 1, b: 2}, (key, value) => {
 *     return {
 *         key: `key-${key}`,
 *         value: `value-${value}`,
 *     };
 * });
 * // output is `{'key-a': 'value-1', 'key-b': 'value-2'}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see
 * - {@link mapObjectValues}: the variant that only maps values.
 */
export function mapObject<
    const OriginalObject extends object,
    const NewKey extends PropertyKey,
    const NewValue,
>(
    originalObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => MaybePromise<{key: NewKey; value: NewValue} | undefined>,
): MaybePromise<Record<NewKey, NewValue>> {
    try {
        let gotAPromise = false as boolean;

        const mappedEntries = getObjectTypedEntries(originalObject)
            .map(
                ([
                    originalKey,
                    originalValue,
                ]) => {
                    const output = mapCallback(originalKey, originalValue, originalObject);
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
                },
            )
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
