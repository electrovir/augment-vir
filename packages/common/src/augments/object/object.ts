import {getEntriesSortedByKey, getObjectTypedKeys} from './object-entries';

export type PartialWithNullable<T extends object> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

export function isObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
}

export function areJsonEqual(a: object, b: object): boolean {
    try {
        const sortedAEntries = getEntriesSortedByKey(a);
        const sortedBEntries = getEntriesSortedByKey(b);
        return JSON.stringify(sortedAEntries) === JSON.stringify(sortedBEntries);
    } catch (error) {
        console.error(`Failed to compare objects using JSON.stringify`);
        throw error;
    }
}

export function filterObject<ObjectGeneric extends object>(
    inputObject: ObjectGeneric,
    callback: (
        key: keyof ObjectGeneric,
        value: ObjectValueType<ObjectGeneric>,
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

/** The input here must be serializable otherwise JSON parsing errors will be thrown */
export function copyThroughJson<T>(input: T): T {
    try {
        return JSON.parse(JSON.stringify(input));
    } catch (error) {
        console.error(`Failed to JSON copy for`, input);
        throw error;
    }
}

export type ObjectValueType<T extends object> = T[keyof T];
