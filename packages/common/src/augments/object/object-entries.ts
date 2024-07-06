import {RemovePartial} from './object';
import {typedHasProperty} from './typed-has-property';

/** @deprecated This is the same as hasKey */
export function isKeyof<ObjectGeneric>(
    key: PropertyKey,
    object: ObjectGeneric,
): key is keyof ObjectGeneric {
    return typedHasProperty(object, key);
}

export function getObjectTypedKeys<ObjectGeneric>(
    input: ObjectGeneric,
): Array<keyof ObjectGeneric> {
    let reflectKeys: Array<keyof ObjectGeneric> | undefined;
    try {
        reflectKeys = Reflect.ownKeys(input as object) as unknown as Array<keyof ObjectGeneric>;
    } catch (error) {}
    return (
        reflectKeys ??
        ([
            ...Object.keys(input as object),
            ...Object.getOwnPropertySymbols(input as object),
        ] as unknown as Array<keyof ObjectGeneric>)
    );
}

export function getObjectTypedValues<ObjectGeneric>(
    input: ObjectGeneric,
): RemovePartial<ObjectGeneric>[keyof RemovePartial<ObjectGeneric>][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as RemovePartial<ObjectGeneric>[keyof RemovePartial<ObjectGeneric>][];
}

export function getObjectTypedEntries<ObjectGeneric>(
    input: ObjectGeneric,
): [keyof ObjectGeneric, RemovePartial<ObjectGeneric>[keyof RemovePartial<ObjectGeneric>]][] {
    return getObjectTypedKeys(input).map((key) => [
        key,
        input[key],
    ]) as [keyof ObjectGeneric, RemovePartial<ObjectGeneric>[keyof RemovePartial<ObjectGeneric>]][];
}

export function getEntriesSortedByKey(input: object): [string, unknown][] {
    return Object.entries(input).sort((tupleA, tupleB) => tupleA[0].localeCompare(tupleB[0]));
}

export function typedObjectFromEntries<KeyType extends PropertyKey, ValueType>(
    entries: ReadonlyArray<Readonly<[KeyType, ValueType]>>,
): Record<KeyType, ValueType> {
    return Object.fromEntries(entries) as Record<KeyType, ValueType>;
}
