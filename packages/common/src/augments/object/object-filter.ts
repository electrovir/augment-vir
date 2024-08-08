import {getObjectTypedKeys} from './object-keys.js';
import {Values} from './object-values.js';

export function filterObject<ObjectGeneric>(
    inputObject: ObjectGeneric,
    callback: (
        key: keyof ObjectGeneric,
        value: Values<ObjectGeneric>,
        fullObject: ObjectGeneric,
    ) => boolean,
): Partial<ObjectGeneric> {
    const filteredKeys = getObjectTypedKeys(inputObject).filter((key) => {
        const value = inputObject[key];
        return callback(key, value, inputObject);
    });
    return filteredKeys.reduce<Partial<ObjectGeneric>>((accum, key) => {
        accum[key] = inputObject[key];
        return accum;
    }, {});
}
