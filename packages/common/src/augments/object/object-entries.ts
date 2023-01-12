import {typedHasProperty} from './typed-has-property';

export function isKeyof<ObjectGeneric>(
    key: PropertyKey,
    object: ObjectGeneric,
): key is keyof ObjectGeneric {
    return typedHasProperty(object, key);
}

export function getObjectTypedKeys<ObjectGeneric extends unknown>(
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

export function getObjectTypedValues<ObjectGeneric extends unknown>(
    input: ObjectGeneric,
): ObjectGeneric[keyof ObjectGeneric][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as ObjectGeneric[keyof ObjectGeneric][];
}

export function getEntriesSortedByKey(input: object): [string, unknown][] {
    return Object.entries(input).sort((tupleA, tupleB) => tupleA[0].localeCompare(tupleB[0]));
}

export function typedObjectFromEntries<KeyType extends PropertyKey, ValueType>(
    entries: ReadonlyArray<Readonly<[KeyType, ValueType]>>,
): Record<KeyType, ValueType> {
    return Object.fromEntries(entries) as Record<KeyType, ValueType>;
}
