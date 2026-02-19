import {check} from '@augment-vir/assert';
import {type AnyObject, type UnknownObject} from '@augment-vir/core';

/**
 * Flattens a nested object into a single-level object.
 *
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {flattenObject} from '@augment-vir/common';
 *
 * flattenObject({a: 'hello', b: {c: 42, d: {e: true, a: 'bye'}}});
 * // {a: 'bye', 'c': 42, 'e': true}
 * ```
 */
export function flattenObject(originalObject: Readonly<AnyObject>): UnknownObject {
    return Object.fromEntries(flattenObjectToEntries(originalObject));
}

function flattenObjectToEntries(originalObject: Readonly<AnyObject>): [PropertyKey, any][] {
    return Object.entries(originalObject).flatMap(
        ([
            key,
            value,
        ]): [PropertyKey, any][] => {
            if (check.isObject(value)) {
                return flattenObjectToEntries(value);
            } else {
                return [
                    [
                        key,
                        value,
                    ],
                ];
            }
        },
    );
}
