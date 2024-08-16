import {type Values} from '@augment-vir/core';
import {getObjectTypedEntries, typedObjectFromEntries} from './object-entries.js';

export function filterObject<ObjectGeneric>(
    inputObject: ObjectGeneric,
    callback: (
        key: keyof ObjectGeneric,
        value: Values<ObjectGeneric>,
        fullObject: ObjectGeneric,
    ) => boolean,
): Partial<ObjectGeneric> {
    const filteredEntries = getObjectTypedEntries(inputObject).filter(
        ([
            key,
            value,
        ]) => {
            return callback(key, value, inputObject);
        },
    );
    return typedObjectFromEntries(filteredEntries) as Partial<ObjectGeneric>;
}
