export type PartialAndNullable<T extends object> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

export type PartialAndUndefined<T extends object> = {
    [Prop in keyof T]?: T[Prop] | undefined;
};

export function isObject(input: any): input is NonNullable<object> {
    return !!input && typeof input === 'object';
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
