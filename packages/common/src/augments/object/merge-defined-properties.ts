import type {AnyObject, PartialWithNullable} from '@augment-vir/core';
import {getObjectTypedEntries} from './object-entries.js';

/**
 * Merge all objects together but ignore any override values that are `undefined` or `null` or
 * missing. This only merges objects at the top level, it is not a deep merge.
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
