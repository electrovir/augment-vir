import {AtLeastOneEntryArray} from '../array';
import {extractErrorMessage} from '../error';
import {isTruthy} from '../function';
import {NoInfer} from '../type';
import {isObject} from './object';
import {getObjectTypedKeys} from './object-entries';
import {typedHasProperty} from './typed-has-property';

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

export type NestedBoolean<MatchObject extends object> = Partial<{
    [Prop in keyof MatchObject]: MatchObject[Prop] extends object
        ? NestedBoolean<MatchObject[Prop]> | boolean
        : boolean;
}>;

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
    noCheckInnerValueOfTheseKeys: NestedBoolean<typeof compareToThisOne> = {},
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
            compareInnerValue(
                testValue,
                shouldMatch,
                throwKeyError,
                allowExtraProps,
                (noCheckInnerValueOfTheseKeys[key] as any) ?? {},
            );
        }
    });
}

function compareInnerValue(
    testValue: unknown,
    matchValue: unknown,
    throwKeyError: (reason: string) => never,
    allowExtraProps: boolean,
    noCheckInnerValueOfTheseKeys: Partial<Record<string, boolean>>,
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
                            noCheckInnerValueOfTheseKeys,
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
        assertMatchesObjectShape<{}>(
            testValue,
            matchValue,
            allowExtraProps,
            noCheckInnerValueOfTheseKeys,
        );
    }
}
