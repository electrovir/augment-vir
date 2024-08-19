import type {AnyObject, CompleteRequire, PartialWithNullable} from '@augment-vir/core';
import {getObjectTypedEntries} from './object-entries.js';

/**
 * Merge all objects together but ignore any override values that are `undefined` or `null` or
 * missing. This only merges objects at the top level, it is not a deep merge.
 */
export function mergeDefinedProperties<const T extends AnyObject>(
    fallback: CompleteRequire<T>,
    ...overrides: ReadonlyArray<PartialWithNullable<T>>
): CompleteRequire<T> {
    const finalObject = {...fallback};

    overrides.forEach((entry) => {
        getObjectTypedEntries(entry).forEach(
            ([
                key,
                value,
            ]) => {
                if (value != undefined) {
                    finalObject[key] = value;
                }
            },
        );
    });

    return finalObject;
}
