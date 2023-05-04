/**
 * Get a value from a map or call the callback and return its result and store the result in the
 * map.
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
        return map.get(mapKey)!;
    } else {
        const newValue = createNewValueCallback();
        map.set(mapKey, newValue);
        return newValue;
    }
}
