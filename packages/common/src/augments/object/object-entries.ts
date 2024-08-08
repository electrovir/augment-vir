import {getObjectTypedKeys} from './object-keys.js';
import {CompleteRequire} from './required-keys.js';

export function getObjectTypedEntries<const ObjectGeneric>(
    input: ObjectGeneric,
): [keyof ObjectGeneric, CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>]][] {
    return getObjectTypedKeys(input).map((key) => [
        key,
        input[key],
    ]) as [
        keyof ObjectGeneric,
        CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>],
    ][];
}

export function typedObjectFromEntries<const KeyType extends PropertyKey, const ValueType>(
    entries: ReadonlyArray<Readonly<[KeyType, ValueType]>>,
): Record<KeyType, ValueType> {
    return Object.fromEntries(entries) as Record<KeyType, ValueType>;
}

export function getEntriesSortedByKey<const ObjectGeneric>(
    input: ObjectGeneric,
): [keyof ObjectGeneric, CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>]][] {
    return getObjectTypedEntries(input).sort((tupleA, tupleB) =>
        String(tupleA[0]).localeCompare(String(tupleB[0])),
    );
}
