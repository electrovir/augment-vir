import {CompleteRequire, getObjectTypedKeys} from '@augment-vir/core';

export function getObjectTypedValues<ObjectGeneric>(
    input: ObjectGeneric,
): CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][];
}
