import {getObjectTypedKeys} from './object-keys.js';
import {CompleteRequire} from './required-keys.js';

export type Values<T> = T[keyof T];
export type ValueAtRequiredKey<Parent, Key extends keyof Parent> = CompleteRequire<Parent>[Key];

export function getObjectTypedValues<ObjectGeneric>(
    input: ObjectGeneric,
): CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][];
}
