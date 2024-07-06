import {RequireAtLeastOne, Writable} from 'type-fest';

export type PartialAndNullable<T extends object> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

export type PartialAndUndefined<T extends object> = {
    [Prop in keyof T]?: T[Prop] | undefined;
};

/** Checks if the input is non-null and an object. Includes arrays. */
export function isObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
}

/** The input here must be serializable otherwise JSON parsing errors will be thrown */
export function copyThroughJson<T>(input: Readonly<T>): Writable<T> {
    try {
        return JSON.parse(JSON.stringify(input));
    } catch (error) {
        console.error(`Failed to JSON copy for`, input);
        throw error;
    }
}

export type PropertyValueType<T> = T[keyof T];

export type ExtractKeysWithMatchingValues<OriginalObject extends object, Matcher> = keyof {
    [Prop in keyof OriginalObject as OriginalObject[Prop] extends Matcher ? Prop : never]: Prop;
};

export type ExcludeKeysWithMatchingValues<OriginalObject extends object, Matcher> = keyof {
    [Prop in keyof OriginalObject as OriginalObject[Prop] extends Matcher ? never : Prop]: Prop;
};

export type RemovePartial<Input> =
    Input extends Partial<Record<infer K extends PropertyKey, infer V>>
        ? Required<Record<K, V>>
        : Required<Input>;

/** Excludes empty objects from a union. */
export type ExcludeEmpty<T> = T extends RequireAtLeastOne<T> ? T : never;
