import {RequiredBy, UnPromise} from './type';

export function getEnumTypedKeys<T extends object>(input: T): (keyof T)[] {
    // enum keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key))) as (keyof T)[];
}

export function getEnumTypedValues<T extends object>(input: T): T[keyof T][] {
    const keys = getEnumTypedKeys(input);
    return keys.map((key) => input[key]);
}

export function isEnumValue<T extends object>(input: unknown, checkEnum: T): input is T[keyof T] {
    return getEnumTypedValues(checkEnum).includes(input as T[keyof T]);
}

export function isKeyof<ObjectGeneric>(
    key: PropertyKey,
    object: ObjectGeneric,
): key is keyof object {
    return typedHasProperty(object, key);
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

export function getObjectTypedKeys<ObjectGeneric extends unknown>(
    input: ObjectGeneric,
): ReadonlyArray<keyof ObjectGeneric> {
    let reflectKeys: ReadonlyArray<keyof ObjectGeneric> | undefined;
    try {
        reflectKeys = Reflect.ownKeys(input as object) as unknown as ReadonlyArray<
            keyof ObjectGeneric
        >;
    } catch (error) {}
    return (
        reflectKeys ??
        ([
            ...Object.keys(input as object),
            ...Object.getOwnPropertySymbols(input as object),
        ] as unknown as ReadonlyArray<keyof ObjectGeneric>)
    );
}

export function getObjectTypedValues<ObjectGeneric extends unknown>(
    input: ObjectGeneric,
): ObjectGeneric[keyof ObjectGeneric][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as ObjectGeneric[keyof ObjectGeneric][];
}

type CombineTypeWithKey<
    KeyGeneric extends PropertyKey,
    ParentGeneric,
> = ParentGeneric extends Partial<Record<KeyGeneric, unknown>>
    ? ParentGeneric & RequiredBy<ParentGeneric, KeyGeneric>
    : ParentGeneric extends
          | Record<KeyGeneric, infer ValueGeneric>
          | Partial<Record<KeyGeneric, infer ValueGeneric>>
          | {}
    ? Extract<ParentGeneric, RequiredBy<Record<KeyGeneric, ValueGeneric>, KeyGeneric>>
    : ParentGeneric & Record<KeyGeneric, unknown>;

export function typedHasProperty<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKey: KeyGeneric,
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    return inputObject && inputKey in inputObject;
}

export function typedHasProperties<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKeys: KeyGeneric[],
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    return inputObject && inputKeys.every((key) => typedHasProperty(inputObject, key));
}

export function isObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
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

export type InnerMappedValues<EntireInputGeneric extends object, MappedValueGeneric> = {
    [MappedProp in keyof EntireInputGeneric]: MappedValueGeneric;
};

export type MappedValues<
    EntireInputGeneric extends object,
    MappedValueGeneric,
> = MappedValueGeneric extends PromiseLike<unknown>
    ? Promise<InnerMappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>>
    : InnerMappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>;

/**
 * Creates a new object with the same properties as the input object, but with values set to the
 * result of mapCallback for each property.
 */
export function mapObject<EntireInputGeneric extends object, MappedValueGeneric>(
    inputObject: EntireInputGeneric,
    mapCallback: (
        inputKey: keyof EntireInputGeneric,
        keyValue: EntireInputGeneric[typeof inputKey],
    ) => MappedValueGeneric,
): MappedValues<EntireInputGeneric, MappedValueGeneric> {
    let gotAPromise = false;

    const mappedObject = getObjectTypedKeys(inputObject).reduce((accum, currentKey) => {
        const mappedValue = mapCallback(currentKey, inputObject[currentKey]);
        if (mappedValue instanceof Promise) {
            gotAPromise = true;
        }
        return {
            ...accum,
            [currentKey]: mappedValue,
        };
    }, {} as MappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>);

    if (gotAPromise) {
        return new Promise<InnerMappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>>(
            async (resolve, reject) => {
                try {
                    await Promise.all(
                        getObjectTypedKeys(mappedObject).map(async (key) => {
                            const value = await mappedObject[key];
                            mappedObject[key] = value;
                        }),
                    );

                    resolve(
                        mappedObject as InnerMappedValues<
                            EntireInputGeneric,
                            UnPromise<MappedValueGeneric>
                        >,
                    );
                } catch (error) {
                    reject(error);
                }
            },
        ) as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    } else {
        return mappedObject as unknown as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    }
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

export function matchesObjectShape<T extends object>(
    testThisOne: unknown,
    compareToThisOne: T,
    allowExtraProps = false,
    shouldLogWhy = false,
): testThisOne is T {
    try {
        assertMatchesObjectShape(testThisOne, compareToThisOne, allowExtraProps);
        return true;
    } catch (error) {
        if (shouldLogWhy) {
            console.error(error);
        }
        return false;
    }
}

export function assertMatchesObjectShape<T extends object>(
    testThisOne: unknown,
    compareToThisOne: T,
    allowExtraProps = false,
): asserts testThisOne is T {
    const testKeys = getObjectTypedKeys(testThisOne);
    const matchKeys = new Set(getObjectTypedKeys(compareToThisOne));

    if (!allowExtraProps) {
        const extraKeys = testKeys.filter((testKey) => !matchKeys.has(testKey));
        if (extraKeys.length) {
            throw new Error(`Test object has extra keys: ${extraKeys.join(', ')}`);
        }
    }
    matchKeys.forEach((key): void => {
        if (!typedHasProperty(testThisOne, key)) {
            throw new Error(`test object does not have key "${String(key)}" from expected shape.`);
        }

        function throwKeyError(reason: string): never {
            throw new Error(
                `test object value at key "${String(key)}" did not match expected shape: ${reason}`,
            );
        }

        const testValue = testThisOne[key];
        const shouldMatch = compareToThisOne[key];

        compareInnerValue(testValue, shouldMatch, throwKeyError);
    });
}

function compareInnerValue(
    testValue: unknown,
    matchValue: unknown,
    throwKeyError: (reason: string) => never,
) {
    const testType = typeof testValue;
    const shouldMatchType = typeof matchValue;

    if (testType !== shouldMatchType) {
        throwKeyError(`type "${testType}" did not match expected type "${shouldMatchType}"`);
    }

    try {
        if (typedHasProperty(matchValue, 'constructor')) {
            if (
                !typedHasProperty(testValue, 'constructor') ||
                testValue.constructor !== matchValue.constructor
            ) {
                throwKeyError(
                    `constructor "${
                        (testValue as any)?.constructor?.name
                    }" did not match expected constructor "${matchValue.constructor}"`,
                );
            }
        }
    } catch (error) {
        // ignore errors from trying to find the constructor
        if (error instanceof throwKeyError) {
            throw error;
        }
    }

    if (Array.isArray(matchValue)) {
        if (!Array.isArray(testValue)) {
            throwKeyError(`expected an array`);
        }

        testValue.forEach((testValueEntry) => {
            const matchValueEntry = matchValue[0];
            compareInnerValue(testValueEntry, matchValueEntry, throwKeyError);
        });
    } else if (isObject(matchValue)) {
        assertMatchesObjectShape(testValue, matchValue);
    }
}
