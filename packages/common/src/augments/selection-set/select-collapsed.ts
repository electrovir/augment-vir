import {check} from '@augment-vir/assert';
import type {AnyObject, Values} from '@augment-vir/core';
import {ExcludeEmpty} from '../object/empty.js';
import {KeyCount} from '../object/key-count.js';
import {
    TsRecurse,
    TsRecursionStart,
    TsRecursionTracker,
    TsTooMuchRecursion,
} from '../type/type-recursion.js';
import {selectFrom} from './select-from.js';
import {
    GenericSelectionSet,
    PickSelection,
    SelectionSet,
    shouldPreserveInSelectionSet,
} from './selection-set.js';

export function selectCollapsedFrom<
    Full extends AnyObject,
    const Selection extends SelectionSet<NoInfer<Full>>,
>(
    originalObject: Readonly<Full>,
    selectionSet: Readonly<Selection>,
): PickCollapsedSelection<Full, Selection> {
    const selected = selectFrom(originalObject, selectionSet);

    return collapseObject(selected, selectionSet) as PickCollapsedSelection<Full, Selection>;
}

function collapseObject(input: Readonly<AnyObject>, selectionSet: unknown): AnyObject {
    if (shouldPreserveInSelectionSet(input)) {
        return input;
    }

    const keys = Object.keys(input);

    if (Array.isArray(input)) {
        return input.map((innerInput) => collapseObject(innerInput, selectionSet));
    } else if (check.isLengthAtLeast(keys, 2)) {
        return input;
    } else if (check.isLengthAtLeast(keys, 1) && check.isObject(selectionSet)) {
        return collapseObject(input[keys[0]], (selectionSet as any)[keys[0]]);
    } else {
        return input;
    }
}

/**
 * Collapses a selected value to the first part of the selection that contains more than 1 key or
 * that is not an object.
 */
export type PickCollapsedSelection<
    Full extends Readonly<AnyObject>,
    Selection extends GenericSelectionSet,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? 'Error: recursive object depth is too deep.'
    : KeyCount<ExcludeEmpty<NonNullable<PickSelection<Full, Selection, Depth>>>> extends 1
      ? Selection[keyof PickSelection<Full, Selection, Depth>] extends GenericSelectionSet
          ?
                | PickCollapsedSelection<
                      NonNullable<Full[keyof PickSelection<Full, Selection, Depth>]>,
                      Selection[keyof PickSelection<Full, Selection, Depth>],
                      TsRecurse<Depth>
                  >
                | Extract<Full[keyof PickSelection<Full, Selection, Depth>], undefined | null>
          : Values<PickSelection<Full, Selection, Depth>>
      : PickSelection<Full, Selection, Depth>;
