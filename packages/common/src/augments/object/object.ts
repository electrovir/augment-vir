import {ensureError} from '../error';
import {JsonCompatibleValue} from '../json-compatible';

export type PartialAndNullable<T extends object> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

export type PartialAndUndefined<T extends object> = {
    [Prop in keyof T]?: T[Prop] | undefined;
};

export function isObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
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

/** The input here must be serializable otherwise JSON parsing errors will be thrown */
export function copyThroughJson<T>(input: T): T {
    try {
        return JSON.parse(JSON.stringify(input));
    } catch (error) {
        console.error(`Failed to JSON copy for`, input);
        throw error;
    }
}

export type PropertyValueType<T> = T[keyof T];
