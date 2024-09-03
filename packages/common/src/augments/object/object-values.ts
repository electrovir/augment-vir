import {CompleteRequire, getObjectTypedKeys} from '@augment-vir/core';

/**
 * Gets an object's values. This is the same as
 * [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
 * except that it has better TypeScript types.
 *
 * @category Object : Common
 * @package @augment-vir/common
 */
export function getObjectTypedValues<ObjectGeneric>(
    input: ObjectGeneric,
): CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][] {
    return getObjectTypedKeys(input).map(
        (key) => input[key],
    ) as CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>][];
}
