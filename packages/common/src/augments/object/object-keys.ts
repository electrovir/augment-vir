import {filterObject} from './object-filter.js';

export function omitObjectKeys<const ObjectGeneric, const KeyGeneric extends keyof ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    omitTheseKeys: ReadonlyArray<KeyGeneric>,
): Omit<ObjectGeneric, KeyGeneric> {
    return filterObject<ObjectGeneric>(inputObject, (currentKey) => {
        return !omitTheseKeys.includes(currentKey as KeyGeneric);
    }) as Omit<ObjectGeneric, KeyGeneric>;
}

export function pickObjectKeys<const ObjectGeneric, const KeyGeneric extends keyof ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    pickTheseKeys: ReadonlyArray<KeyGeneric>,
): Pick<ObjectGeneric, KeyGeneric> {
    return filterObject<ObjectGeneric>(inputObject, (currentKey) => {
        return pickTheseKeys.includes(currentKey as KeyGeneric);
    }) as Pick<ObjectGeneric, KeyGeneric>;
}

export type ExtractKeysWithMatchingValues<OriginalObject extends object, Matcher> = keyof {
    [Prop in keyof OriginalObject as OriginalObject[Prop] extends Matcher ? Prop : never]: Prop;
};

export type ExcludeKeysWithMatchingValues<OriginalObject extends object, Matcher> = keyof {
    [Prop in keyof OriginalObject as OriginalObject[Prop] extends Matcher ? never : Prop]: Prop;
};
