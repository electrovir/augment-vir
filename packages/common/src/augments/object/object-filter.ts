import {type Values} from '@augment-vir/core';
import {getObjectTypedEntries, typedObjectFromEntries} from './object-entries.js';

/**
 * Filters an object. Like
 * [`[].filter`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)
 * but for objects.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {filterObject} from '@augment-vir';
 *
 * filterObject({a: 1, b: 2, c: 3}, (key, value) => {
 *     return value >= 2;
 * });
 * // output is `{b: 2, c: 3}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function filterObject<ObjectGeneric>(
    inputObject: ObjectGeneric,
    callback: (
        key: keyof ObjectGeneric,
        value: Values<ObjectGeneric>,
        fullObject: ObjectGeneric,
    ) => boolean,
): Partial<ObjectGeneric> {
    const filteredEntries = getObjectTypedEntries(inputObject).filter(
        ([
            key,
            value,
        ]) => {
            return callback(key, value, inputObject);
        },
    );
    return typedObjectFromEntries(filteredEntries) as Partial<ObjectGeneric>;
}
