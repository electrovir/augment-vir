import {AtLeastOneEntryArray} from './array';
import {extractErrorMessage} from './error';
import {isTruthy} from './function';
import {NoInfer, RequiredBy, UnPromise} from './type';

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

type ExtractValue<
    KeyGeneric extends PropertyKey,
    ParentGeneric,
> = KeyGeneric extends keyof ParentGeneric
    ? RequiredBy<ParentGeneric, KeyGeneric>[KeyGeneric]
    : KeyGeneric extends keyof Extract<ParentGeneric, Record<KeyGeneric, any>>
    ? RequiredBy<Extract<ParentGeneric, Record<KeyGeneric, any>>, KeyGeneric>[KeyGeneric]
    : never;

type CombinedParentValue<KeyGeneric extends PropertyKey, ParentGeneric> = ExtractValue<
    KeyGeneric,
    ParentGeneric
> extends never
    ? unknown
    : ExtractValue<KeyGeneric, ParentGeneric>;

type CombineTypeWithKey<KeyGeneric extends PropertyKey, ParentGeneric> = ParentGeneric &
    Record<KeyGeneric, CombinedParentValue<KeyGeneric, ParentGeneric>>;

const hasPropertyAttempts: ReadonlyArray<(object: object, key: PropertyKey) => boolean> = [
    (object, key) => {
        return key in object;
    },
    (object, key) => {
        /** This handles cases where the input object can't use `in` directly, like string literals */
        return key in object.constructor.prototype;
    },
];

export function typedHasProperty<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKey: KeyGeneric,
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    if (!inputObject) {
        return false;
    }
    return hasPropertyAttempts.some((attemptCallback) => {
        try {
            return attemptCallback(inputObject, inputKey);
        } catch (error) {
            return false;
        }
    });
}

export function typedHasProperties<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKeys: ReadonlyArray<KeyGeneric>,
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
export function mapObjectValues<EntireInputGeneric extends object, MappedValueGeneric>(
    inputObject: EntireInputGeneric,
    mapCallback: (
        inputKey: keyof EntireInputGeneric,
        keyValue: EntireInputGeneric[typeof inputKey],
        fullObject: EntireInputGeneric,
    ) => MappedValueGeneric,
): MappedValues<EntireInputGeneric, MappedValueGeneric> {
    let gotAPromise = false;

    const mappedObject = getObjectTypedKeys(inputObject).reduce((accum, currentKey) => {
        const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);
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

/**
 * Checks that the first input, testThisOne, matches the object shape of the second input,
 * compareToThisOne. Does not compare exact values of properties, only types.
 *
 * To allow the test input, the first input, to have additional keys that the compare input, the
 * second input, does not have, pass in a third argument set to true.
 *
 * This function REQUIRES a generic to be assigned to it: it cannot infer it from the inputs.
 *
 * The compare input, the second input, is required to have at least one entry in every array value
 * that exists. If more array values are present, they will be considered other possible types for
 * entries in that array.
 */
export function matchesObjectShape<MatchThisGeneric extends object>(
    testThisOne: unknown,
    compareToThisOne: NoInfer<ObjectWithAtLeastSingleEntryArrays<MatchThisGeneric>>,
    allowExtraProps = false,
    shouldLogWhy = false,
): testThisOne is MatchThisGeneric {
    try {
        assertMatchesObjectShape<MatchThisGeneric>(testThisOne, compareToThisOne, allowExtraProps);
        return true;
    } catch (error) {
        if (shouldLogWhy) {
            console.error(error);
        }
        return false;
    }
}

export type ObjectWithAtLeastSingleEntryArrays<BaseObject extends object> = {
    [Prop in keyof BaseObject]: BaseObject[Prop] extends ReadonlyArray<any>
        ? AtLeastOneEntryArray<BaseObject[Prop]>
        : BaseObject[Prop] extends object
        ? ObjectWithAtLeastSingleEntryArrays<BaseObject[Prop]>
        : BaseObject[Prop];
};

/**
 * Asserts that the first input, testThisOne, matches the object shape of the second input,
 * compareToThisOne. Does not compare exact values of properties, only types.
 *
 * To allow the test input, the first input, to have additional keys that the compare input, the
 * second input, does not have, pass in a third argument set to true.
 *
 * This function REQUIRES a generic to be assigned to it: it cannot infer it from the inputs.
 *
 * The compare input, the second input, is required to have at least one entry in every array value
 * that exists. If more array values are present, they will be considered other possible types for
 * entries in that array.
 */
export function assertMatchesObjectShape<MatchThisGeneric extends object = never>(
    testThisOne: unknown,
    compareToThisOne: NoInfer<ObjectWithAtLeastSingleEntryArrays<MatchThisGeneric>>,
    allowExtraProps = false,
    noCheckInnerValueOfTheseKeys: Partial<Record<keyof typeof compareToThisOne, boolean>> = {},
): asserts testThisOne is MatchThisGeneric {
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

        if (!noCheckInnerValueOfTheseKeys[key]) {
            compareInnerValue(testValue, shouldMatch, throwKeyError, allowExtraProps);
        }
    });
}

function compareInnerValue(
    testValue: unknown,
    matchValue: unknown,
    throwKeyError: (reason: string) => never,
    allowExtraProps: boolean,
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

        testValue.forEach((testValueEntry, index) => {
            const errors = matchValue
                .map((matchValue) => {
                    try {
                        compareInnerValue(
                            testValueEntry,
                            matchValue,
                            throwKeyError,
                            allowExtraProps,
                        );
                        return undefined;
                    } catch (error) {
                        return new Error(
                            `entry at index "${index}" did not match expected shape: ${extractErrorMessage(
                                error,
                            )}`,
                        );
                    }
                })
                .filter(isTruthy);

            if (errors.length === matchValue.length) {
                throw new Error(
                    `entry at index "${index}" did not match any of the possible types from "${matchValue.join(
                        ', ',
                    )}"`,
                );
            }
        });
    } else if (isObject(matchValue)) {
        assertMatchesObjectShape<{}>(testValue, matchValue, allowExtraProps);
    }
}

export function typedObjectFromEntries<KeyType extends PropertyKey, ValueType>(
    entries: ReadonlyArray<Readonly<[KeyType, ValueType]>>,
): Record<KeyType, ValueType> {
    return Object.fromEntries(entries) as Record<KeyType, ValueType>;
}
