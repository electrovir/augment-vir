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
import {selectFrom, shouldPreserveInSelectionSet} from './select-from.js';
import {GenericSelectionSet, SelectFrom, SelectionSet} from './selection-set.js';

/**
 * The same as {@link selectFrom} except that the final output is collapsed until the first nested
 * value that has more than 1 key or that is not an object.
 *
 * @category Selection
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {selectCollapsedFrom} from '@augment-vir/common';
 *
 * selectCollapsedFrom(
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
 * // output is `[3, 4]`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
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
 * that is not an object. This produces the output type for {@link selectCollapsedFrom}.
 *
 * @category Selection
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PickCollapsedSelection<
    Full extends Readonly<AnyObject>,
    Selection extends SelectionSet<Full>,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? 'Error: recursive object depth is too deep.'
    : KeyCount<ExcludeEmpty<NonNullable<SelectFrom<Full, Selection, Depth>>>> extends 1
      ? Selection[keyof SelectFrom<Full, Selection, Depth>] extends GenericSelectionSet
          ?
                | PickCollapsedSelection<
                      NonNullable<Full[keyof SelectFrom<Full, Selection, Depth>]>,
                      Selection[keyof SelectFrom<Full, Selection, Depth>],
                      TsRecurse<Depth>
                  >
                | Extract<Full[keyof SelectFrom<Full, Selection, Depth>], undefined | null>
          : Values<SelectFrom<Full, Selection, Depth>>
      : SelectFrom<Full, Selection, Depth>;
