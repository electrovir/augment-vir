import {ensureError} from './error';
import {JsonCompatibleValue} from './json-compatible';
import {assertMatchesObjectShape} from './object/matches-object-shape';
import {isObject} from './object/object';
import {assertRuntimeTypeOf, getRuntimeTypeOf, isRuntimeTypeOf} from './runtime-type-of';

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
            if (isRuntimeTypeOf(shapeMatcher, 'object')) {
                assertMatchesObjectShape<any>(parsedJson, shapeMatcher);
            } else {
                assertRuntimeTypeOf(parsedJson, getRuntimeTypeOf(shapeMatcher), 'parsedJson');
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

const areJsonEqualFailureMessage = 'Failed to compare objects using JSON.stringify';

function baseAreJsonEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function areJsonEqual(
    a: Readonly<JsonCompatibleValue | undefined>,
    b: Readonly<JsonCompatibleValue | undefined>,
): boolean {
    try {
        if (a === b) {
            return true;
        }

        if (isObject(a) && isObject(b)) {
            const areKeysEqual = baseAreJsonEqual(Object.keys(a).sort(), Object.keys(b).sort());
            if (!areKeysEqual) {
                return false;
            }

            return Object.keys(a).every((keyName) => {
                return areJsonEqual(a[keyName as any], b[keyName as any]);
            });
        } else {
            return baseAreJsonEqual(a, b);
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
