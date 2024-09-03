import {check} from '@augment-vir/assert';
import type {AnyObject} from '@augment-vir/core';
import {mapObjectValues} from '../object/map-values.js';
import {omitObjectKeys} from '../object/object-keys.js';
import {SelectFrom, SelectionSet} from './selection-set.js';

/**
 * Determine if the given input should be preserved in the selection output, meaning it won't be
 * recursed into.
 *
 * @ignore
 */
export function shouldPreserveInSelectionSet(input: unknown): boolean {
    return check.isPrimitive(input) || input instanceof RegExp || input instanceof Promise;
}

/**
 * Performs a SQL-like nested selection on an object, extracting the selected values.
 *
 * @category Selection : Common
 * @example
 *
 * ```ts
 * import {selectFrom} from '@augment-vir/common';
 *
 * selectFrom(
 *     [
 *         {
 *             child: {
 *                 grandChild: 'hi',
 *                 grandChild2: 3,
 *                 grandChild3: /something/,
 *             },
 *         },
 *         {
 *             child: {
 *                 grandChild: 'hi',
 *                 grandChild2: 4,
 *                 grandChild3: /something/,
 *             },
 *         },
 *     ],
 *     {
 *         child: {
 *             grandChild2: true,
 *         },
 *     },
 * );
 * // output is `[{child: {grandChild2: 3}}, {child: {grandChild2: 4}}]`
 * ```
 *
 * @package @augment-vir/common
 */
export function selectFrom<
    Full extends AnyObject,
    const Selection extends SelectionSet<NoInfer<Full>>,
>(originalObject: Readonly<Full>, selectionSet: Readonly<Selection>): SelectFrom<Full, Selection> {
    if (Array.isArray(originalObject)) {
        return originalObject.map((originalEntry) =>
            selectFrom(originalEntry, selectionSet),
        ) as SelectFrom<Full, Selection>;
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
    ) as SelectFrom<Full, Selection>;
}
