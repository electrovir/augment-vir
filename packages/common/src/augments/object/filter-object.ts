import {PropertyValueType} from './object';
import {getObjectTypedKeys} from './object-entries';

export function filterObject<ObjectGeneric>(
    inputObject: ObjectGeneric,
    callback: (
        key: keyof ObjectGeneric,
        value: PropertyValueType<ObjectGeneric>,
        fullObject: ObjectGeneric,
    ) => boolean,
): Partial<ObjectGeneric> {
    const filteredKeys = getObjectTypedKeys(inputObject).filter((key) => {
        const value = inputObject[key];
        return callback(key, value, inputObject);
    });
    return filteredKeys.reduce((accum, key) => {
        accum[key] = inputObject[key];
        return accum;
    }, {} as Partial<ObjectGeneric>);
}

export function omitObjectKeys<ObjectGeneric, KeyGeneric extends keyof ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    omitTheseKeys: ReadonlyArray<KeyGeneric>,
): Omit<ObjectGeneric, KeyGeneric> {
    return filterObject<ObjectGeneric>(inputObject, (currentKey) => {
        return !omitTheseKeys.includes(currentKey as KeyGeneric);
    }) as Omit<ObjectGeneric, KeyGeneric>;
}

export function pickObjectKeys<ObjectGeneric, KeyGeneric extends keyof ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    pickTheseKeys: ReadonlyArray<KeyGeneric>,
): Pick<ObjectGeneric, KeyGeneric> {
    return filterObject<ObjectGeneric>(inputObject, (currentKey) => {
        return pickTheseKeys.includes(currentKey as KeyGeneric);
    }) as Pick<ObjectGeneric, KeyGeneric>;
}
