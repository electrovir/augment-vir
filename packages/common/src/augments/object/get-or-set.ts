import {check} from '@augment-vir/assert';
import {ensureError, MaybePromise, type AnyObject} from '@augment-vir/core';

/**
 * Get a value from a map or call the callback and return its result and store the result in the
 * map.
 *
 * @category Object:Common
 */
export function getOrSetFromMap<MapKey extends object, MapValue>(
    map: WeakMap<MapKey, MapValue>,
    key: MapKey,
    createNewValueCallback: () => MapValue,
): MapValue;
export function getOrSetFromMap<MapKey, MapValue>(
    map: Map<MapKey, MapValue>,
    key: MapKey,
    createNewValueCallback: () => MapValue,
): MapValue;
export function getOrSetFromMap<MapKey, MapValue>(
    map: Map<MapKey, MapValue> | WeakMap<MapKey & object, MapValue>,
    key: MapKey,
    createNewValueCallback: () => MapValue,
): MapValue {
    const mapKey = key as any;

    if (map.has(mapKey)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return map.get(mapKey)!;
    } else {
        const newValue = createNewValueCallback();
        map.set(mapKey, newValue);
        return newValue;
    }
}

/**
 * Given an object, tries to get the given key in that object. If the key is not in that object,
 * then the given `createCallback` is used to create a new value which is then stored in the given
 * object and returned. Automatically handles `createCallback` returning a promise, if it does.
 *
 * @category Object:Common
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
 * getOrSetInObject(myObject, myKey, () => {});
 * ```
 */
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
