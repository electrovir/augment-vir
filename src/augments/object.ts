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
