import {CompleteRequire} from '@augment-vir/core';
import {getObjectTypedKeys} from './object-keys.js';

export function getObjectTypedValues<ObjectGeneric>(
    input: ObjectGeneric,
): CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][];
}
