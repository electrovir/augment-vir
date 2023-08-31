import {getObjectTypedKeys} from './object-entries';

export type EnumBaseType = Record<string, number | string>;

export function getEnumTypedKeys<T extends EnumBaseType>(input: T): (keyof T)[] {
    // enum keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key))) as (keyof T)[];
}

export function getEnumTypedValues<T extends EnumBaseType>(input: T): T[keyof T][] {
    const keys = getEnumTypedKeys(input);
    return keys.map((key) => input[key]);
}

/** Check if the given value is within the given enum. */
export function isEnumValue<T extends EnumBaseType>(
    input: unknown,
    checkEnum: T,
): input is T[keyof T] {
    return getEnumTypedValues(checkEnum).includes(input as T[keyof T]);
}

/** Interpret a primitive as an enum value with type safety. */
export function ensureEnum<
    const ValueType extends `${EnumType[keyof EnumType]}`,
    const EnumType extends EnumBaseType,
>(value: ValueType, checkEnum: EnumType): EnumType[keyof EnumType] {
    if (isEnumValue(value, checkEnum)) {
        return value;
    } else {
        const enumValues = getEnumTypedValues(checkEnum);
        throw new Error(
            `Given value '${value}' does not match given enum. Possible enum values: ${enumValues.join(
                ',',
            )}`,
        );
    }
}

export function filterToEnumValues<T extends EnumBaseType>(
    inputs: ReadonlyArray<unknown>,
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
