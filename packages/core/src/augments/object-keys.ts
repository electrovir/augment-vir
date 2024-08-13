export function getObjectTypedKeys<const ObjectGeneric>(
    input: ObjectGeneric,
): Array<keyof ObjectGeneric> {
    let reflectKeys: Array<keyof ObjectGeneric> | undefined;
    try {
        reflectKeys = Reflect.ownKeys(input as object) as unknown as Array<keyof ObjectGeneric>;
    } catch {
        // do nothing
    }
    return (
        reflectKeys ??
        ([
            ...Object.keys(input as object),
            ...Object.getOwnPropertySymbols(input as object),
        ] as unknown as Array<keyof ObjectGeneric>)
    );
}

export type ExtractKeysWithMatchingValues<OriginalObject extends object, Matcher> = keyof {
    [Prop in keyof OriginalObject as OriginalObject[Prop] extends Matcher ? Prop : never]: Prop;
};

export type ExcludeKeysWithMatchingValues<OriginalObject extends object, Matcher> = keyof {
    [Prop in keyof OriginalObject as OriginalObject[Prop] extends Matcher ? never : Prop]: Prop;
};
