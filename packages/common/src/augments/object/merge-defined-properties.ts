import type {AnyObject, PartialWithNullable} from '@augment-vir/core';
import {getObjectTypedEntries} from './object-entries.js';

/**
 * Merge all objects together but ignore any override values that are `undefined` or `null` or
 * missing. This only merges objects at the top level, it is not a deep merge.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {mergeDefinedProperties} from '@augment-vir/common';
 *
 * mergeDefinedProperties({a: 'default', b: 'default'}, {a: 'override', b: undefined});
 * // output is `{a: 'override', b: 'default'}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function mergeDefinedProperties<const T extends AnyObject>(
    original: T,
    ...overrides: ReadonlyArray<PartialWithNullable<NoInfer<T>> | undefined>
): T {
    const finalObject = {...original};

    overrides.forEach((entry) => {
        if (!entry) {
            return;
        }

        getObjectTypedEntries(entry).forEach(
            ([
                key,
                value,
            ]) => {
                if (value != undefined) {
                    finalObject[key] = value as T[keyof T];
                }
            },
        );
    });

    return finalObject;
}
