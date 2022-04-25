import {ArrayElement} from './type';

export function getEnumTypedKeys<T>(input: T): (keyof T)[] {
    // keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key))) as (keyof T)[];
}

export function getEnumTypedValues<T>(input: T): T[keyof T][] {
    const keys = getEnumTypedKeys(input);
    return keys.map((key) => input[key]);
}

export function isEnumValue<T extends object>(input: unknown, checkEnum: T): input is T[keyof T] {
    return getEnumTypedValues(checkEnum).includes(input as T[keyof T]);
}

export function filterToEnumValues<T extends object>(
    inputs: unknown[],
    checkEnum: T,
    caseInsensitive = false,
): T[keyof T][] {
    if (caseInsensitive) {
        return inputs.reduce((accum: T[keyof T][], currentInput) => {
            const matchedEnumValue = getEnumTypedValues(checkEnum).find((actualEnumValue) => {
                return String(actualEnumValue).toUpperCase() === String(currentInput).toUpperCase();
            });

            if (matchedEnumValue) {
                return accum.concat(matchedEnumValue);
            } else {
                return accum;
            }
        }, []);
    } else {
        return inputs.filter((input): input is T[keyof T] => isEnumValue(input, checkEnum));
    }
}

export function getObjectTypedKeys<T>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

export function getObjectTypedValues<T>(input: T): T[keyof T][] {
    return Object.values(input) as T[keyof T][];
}

export function typedHasOwnProperty<ObjectGeneric extends object, KeyGeneric extends PropertyKey>(
    inputKey: KeyGeneric,
    inputObject: ObjectGeneric,
): inputObject is ObjectGeneric & Record<KeyGeneric, unknown> {
    return (
        typeof inputObject === 'object' &&
        inputObject &&
        Object.prototype.hasOwnProperty.call(inputObject, inputKey)
    );
}

export function typedHasOwnProperties<
    ObjectGeneric extends object,
    KeyGenerics extends PropertyKey[],
>(
    inputKeys: KeyGenerics,
    inputObject: ObjectGeneric,
): inputObject is ObjectGeneric & Record<ArrayElement<KeyGenerics>, unknown> {
    return (
        typeof inputObject === 'object' &&
        inputObject &&
        inputKeys.every((key) => Object.prototype.hasOwnProperty.call(inputObject, key))
    );
}

export function isObject(input: any): input is NonNullable<object> {
    return typeof input === 'object' && !!input;
}

export function getEntriesSortedByKey(input: object): [string, unknown][] {
    return Object.entries(input).sort((tupleA, tupleB) => tupleA[0].localeCompare(tupleB[0]));
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

export type MappedValues<EntireInputGeneric extends object, MappedValuesGeneric> = {
    [MappedProp in keyof EntireInputGeneric]: MappedValuesGeneric;
};

export function mapObject<EntireInputGeneric extends object, MappedValuesGeneric>(
    inputObject: EntireInputGeneric,
    mapCallback: (
        inputKey: keyof EntireInputGeneric,
        keyValue: EntireInputGeneric[typeof inputKey],
    ) => MappedValuesGeneric,
): MappedValues<EntireInputGeneric, MappedValuesGeneric> {
    return getObjectTypedKeys(inputObject).reduce((accum, currentKey) => {
        return {
            ...accum,
            [currentKey]: mapCallback(currentKey, inputObject[currentKey]),
        };
    }, {} as MappedValues<EntireInputGeneric, MappedValuesGeneric>);
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
