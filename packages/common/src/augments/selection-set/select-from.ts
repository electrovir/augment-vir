import type {AnyObject} from '@augment-vir/core';
import {mapObjectValues} from '../object/map-values.js';
import {omitObjectKeys} from '../object/object-keys.js';
import {PickSelection, SelectionSet, shouldPreserveInSelectionSet} from './selection-set.js';

export function selectFrom<
    Full extends AnyObject,
    const Selection extends SelectionSet<NoInfer<Full>>,
>(
    originalObject: Readonly<Full>,
    selectionSet: Readonly<Selection>,
): PickSelection<Full, Selection> {
    if (Array.isArray(originalObject)) {
        return originalObject.map((originalEntry) =>
            selectFrom(originalEntry, selectionSet),
        ) as PickSelection<Full, Selection>;
    }

    const keysToRemove: PropertyKey[] = [];

    return omitObjectKeys<any, any>(
        mapObjectValues(originalObject, (key, value) => {
            const selection = selectionSet[key];

            if (selection === true) {
                return value;
            } else if (!selection) {
                keysToRemove.push(key);
                return undefined;
            } else if (shouldPreserveInSelectionSet(value)) {
                return value;
            } else {
                return selectFrom(value, selection);
            }
        }),
        keysToRemove,
    ) as PickSelection<Full, Selection>;
}
