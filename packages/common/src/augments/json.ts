import {assertRunTimeType, getRunTimeType, isRunTimeType} from 'run-time-assertions';
import {ensureError} from './error';
import {JsonCompatibleValue} from './json-compatible';
import {assertMatchesObjectShape} from './object/matches-object-shape';
import {isObject} from './object/object';

export function parseJson<ParsedJsonGeneric>({
    jsonString,
    errorHandler,
    shapeMatcher,
}: {
    jsonString: string;
    errorHandler?: (error: unknown) => never | ParsedJsonGeneric;
    shapeMatcher?: ParsedJsonGeneric;
}): ParsedJsonGeneric {
    try {
        const parsedJson = JSON.parse(jsonString);

        if (shapeMatcher != undefined) {
            if (isRunTimeType(shapeMatcher, 'object')) {
                assertMatchesObjectShape<any>(parsedJson, shapeMatcher);
            } else {
                assertRunTimeType(parsedJson, getRunTimeType(shapeMatcher), 'parsedJson');
            }
        }

        return parsedJson as ParsedJsonGeneric;
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        } else {
            throw error;
        }
    }
}

export function stringifyJson({
    source,
    whitespace,
    errorHandler,
}: {
    source: unknown;
    whitespace?: number;
    errorHandler?: (error: unknown) => string | never;
}): string {
    try {
        const stringifiedJson = JSON.stringify(source, undefined, whitespace);

        return stringifiedJson;
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        } else {
            throw error;
        }
    }
}

const areJsonEqualFailureMessage = 'Failed to compare objects using JSON.stringify';

function baseAreJsonEqual(a: unknown, b: unknown, ignoreStringifyErrors: boolean): boolean {
    return (
        stringifyJson({
            source: a,
            errorHandler(error) {
                if (ignoreStringifyErrors) {
                    return '';
                } else {
                    throw error;
                }
            },
        }) ===
        stringifyJson({
            source: b,
            errorHandler(error) {
                if (ignoreStringifyErrors) {
                    return '';
                } else {
                    throw error;
                }
            },
        })
    );
}

export function areJsonEqual(
    a: Readonly<JsonCompatibleValue | undefined>,
    b: Readonly<JsonCompatibleValue | undefined>,
    options: Partial<{
        ignoreNonSerializableProperties: boolean | undefined;
    }> = {},
): boolean {
    try {
        if (a === b) {
            return true;
        }

        if (isObject(a) && isObject(b)) {
            const areKeysEqual = baseAreJsonEqual(
                Object.keys(a).sort(),
                Object.keys(b).sort(),
                !!options?.ignoreNonSerializableProperties,
            );
            if (!areKeysEqual) {
                return false;
            }

            return Object.keys(a).every((keyName) => {
                return areJsonEqual(a[keyName as any], b[keyName as any]);
            });
        } else {
            return baseAreJsonEqual(a, b, !!options?.ignoreNonSerializableProperties);
        }
    } catch (caught) {
        const error = ensureError(caught);
        if (error.message.startsWith(areJsonEqualFailureMessage)) {
            throw error;
        }
        error.message = `${areJsonEqualFailureMessage}: ${error.message}`;
        throw error;
    }
}
