import {Jsonifiable} from 'type-fest';
import {extractErrorMessage} from '../error';
import {getEntriesSortedByKey} from './object-entries';

export type PartialWithNullable<T extends object> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

export function isObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
}

export function areJsonEqual(a: Jsonifiable, b: Jsonifiable): boolean {
    try {
        if (a === b) {
            return true;
        }

        if (isObject(a) && isObject(b)) {
            const sortedAEntries = getEntriesSortedByKey(a);
            const sortedBEntries = getEntriesSortedByKey(b);
            return JSON.stringify(sortedAEntries) === JSON.stringify(sortedBEntries);
        } else {
            return JSON.stringify(a) === JSON.stringify(b);
        }
    } catch (error) {
        console.error(
            `Failed to compare objects using JSON.stringify: ${extractErrorMessage(error)}`,
        );
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
