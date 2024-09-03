import {check} from '@augment-vir/assert';
import {ensureError, MaybePromise, type AnyObject} from '@augment-vir/core';

export function getOrSetFromMap<MapKey extends object, MapValue>(
    map: WeakMap<MapKey, MapValue>,
    key: MapKey,
    createCallback: () => MapValue,
): MapValue;
export function getOrSetFromMap<MapKey, MapValue>(
    map: Map<MapKey, MapValue>,
    key: MapKey,
    createCallback: () => MapValue,
): MapValue;

export function getOrSetFromMap<MapKey extends object, MapValue>(
    map: WeakMap<MapKey, MapValue>,
    key: MapKey,
    createCallback: () => Promise<MapValue>,
): Promise<MapValue>;
export function getOrSetFromMap<MapKey, MapValue>(
    map: Map<MapKey, MapValue>,
    key: MapKey,
    createCallback: () => Promise<MapValue>,
): Promise<MapValue>;

export function getOrSetFromMap<MapKey extends object, MapValue>(
    map: WeakMap<MapKey, MapValue>,
    key: MapKey,
    createCallback: () => MaybePromise<MapValue>,
): MaybePromise<MapValue>;
export function getOrSetFromMap<MapKey, MapValue>(
    map: Map<MapKey, MapValue>,
    key: MapKey,
    createCallback: () => MaybePromise<MapValue>,
): MaybePromise<MapValue>;

/**
 * Given an map, tries to get the given key in that map. If the key is not in that map, then the
 * given `createCallback` is used to create a new value which is then stored in the given map and
 * returned. Automatically handles an async `createCallback`.
 *
 * @category Object : Common
 * @example
 *
 * ```ts
 * // instead of doing this
 * if (!myMap.get(myKey)) {
 *     myMap.set(myKey, {});
 * }
 * myMap.get(myKey)![nextKey] = 'some value';
 *
 * // do this
 * getOrSetInObject(myMap, myKey, () => {
 *     return {};
 * });
 * ```
 *
 * @package @augment-vir/common
 */
export function getOrSetFromMap<MapKey, MapValue>(
    map: Map<MapKey, MapValue> | WeakMap<MapKey & object, MapValue>,
    key: MapKey,
    createCallback: () => MaybePromise<MapValue>,
): MaybePromise<MapValue> {
    const mapKey = key as any;

    if (mapKey in map) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return map.get(mapKey)!;
    } else {
        const createdValue = createCallback();
        if (check.isPromise(createdValue)) {
            return new Promise<MapValue>(async (resolve, reject) => {
                try {
                    const awaitedValue = await createdValue;
                    map.set(mapKey, awaitedValue);
                    resolve(awaitedValue);
                } catch (error) {
                    reject(ensureError(error));
                }
            });
        } else {
            map.set(mapKey, createdValue);

            return createdValue;
        }
    }
}

export function getOrSet<OriginalObject extends AnyObject, Key extends keyof OriginalObject>(
    originalObject: OriginalObject,
    key: Key,
    createCallback: () => OriginalObject[Key],
): Required<OriginalObject>[Key];
export function getOrSet<OriginalObject extends AnyObject, Key extends keyof OriginalObject>(
    originalObject: OriginalObject,
    key: Key,
    createCallback: () => Promise<OriginalObject[Key]>,
): Promise<Required<OriginalObject>[Key]>;
export function getOrSet<OriginalObject extends AnyObject, Key extends keyof OriginalObject>(
    originalObject: OriginalObject,
    key: Key,
    createCallback: () => MaybePromise<OriginalObject[Key]>,
): MaybePromise<Required<OriginalObject>[Key]>;
/**
 * Given an object, tries to get the given key in that object. If the key is not in that object,
 * then the given `createCallback` is used to create a new value which is then stored in the given
 * object and returned. Automatically handles an async `createCallback`.
 *
 * @category Object : Common
 * @example
 *
 * ```ts
 * // instead of doing this
 * if (!myObject[myKey]) {
 *     myObject[myKey] = {};
 * }
 * myObject[myKey]![nextKey] = 'some value';
 *
 * // do this
 * getOrSetInObject(myObject, myKey, () => {
 *     return {};
 * });
 * ```
 *
 * @package @augment-vir/common
 */
export function getOrSet<OriginalObject extends AnyObject, Key extends keyof OriginalObject>(
    originalObject: OriginalObject,
    key: Key,
    createCallback: () => MaybePromise<OriginalObject[Key]>,
): MaybePromise<Required<OriginalObject>[Key]> {
    if (key in originalObject) {
        return originalObject[key];
    } else {
        const createdValue = createCallback();
        if (check.isPromise(createdValue)) {
            return new Promise<OriginalObject[Key]>(async (resolve, reject) => {
                try {
                    const awaitedValue = await createdValue;
                    originalObject[key] = awaitedValue;
                    resolve(awaitedValue);
                } catch (error) {
                    reject(ensureError(error));
                }
            });
        } else {
            originalObject[key] = createdValue;

            return createdValue;
        }
    }
}
