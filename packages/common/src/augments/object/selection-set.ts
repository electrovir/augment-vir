import {IsAny, IsNever, Primitive} from 'type-fest';
import {
    TsRecurse,
    TsRecursionStart,
    TsRecursionTracker,
    TsTooMuchRecursion,
} from '../type-recursion';
import {UnionToIntersection} from '../union';
import {AnyObject} from './any-object';
import {omitObjectKeys} from './filter-object';
import {KeyCount} from './key-count';
import {mapObjectValues} from './map-object';
import {PropertyValueType} from './object';

/** All types that won't be recursed into when defining a {@link SelectionSet}. */
export type SelectionTypesToPreserve = Primitive | RegExp;

/** A generic selection set without specific keys. */
export type GenericSelectionSet = {[Key in PropertyKey]: boolean | GenericSelectionSet};

/** Masks an object value with the given {@link SelectionSet}. */
export type PickSelection<
    Full extends Readonly<AnyObject>,
    Selection extends GenericSelectionSet,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? ['Error: recursive object depth is too deep.']
    : Full extends ReadonlyArray<infer Element extends any>
      ? (
            | PickSelection<Extract<Element, AnyObject>, Selection, TsRecurse<Depth>>
            | Exclude<Element, AnyObject>
        )[]
      : {
            -readonly [Key in keyof Selection as Selection[Key] extends false
                ? never
                : Key extends keyof Full
                  ? Key
                  : never]:
                | (Selection[Key] extends GenericSelectionSet
                      ? PickSelection<
                            NonNullable<Extract<Full[Key], AnyObject>>,
                            Selection[Key],
                            TsRecurse<Depth>
                        >
                      : Full[Key])
                | Exclude<Full[Key], AnyObject>;
        };

/**
 * Collapses a selected value to the first part of the selection that contains more than 1 key or
 * that is not an object.
 */
export type FirstSelectedValue<
    Full extends Readonly<AnyObject>,
    Selection extends GenericSelectionSet,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? 'Error: recursive object depth is too deep.'
    : KeyCount<PickSelection<Full, Selection, Depth>> extends 1
      ? Selection[keyof PickSelection<Full, Selection, Depth>] extends GenericSelectionSet
          ? FirstSelectedValue<
                Full[keyof PickSelection<Full, Selection, Depth>],
                Selection[keyof PickSelection<Full, Selection, Depth>],
                TsRecurse<Depth>
            >
          : PropertyValueType<PickSelection<Full, Selection, Depth>>
      : PickSelection<Full, Selection, Depth>;

/** Defines a selection set for the given object. */
export type SelectionSet<
    Full extends Readonly<AnyObject>,
    Depth extends TsRecursionTracker = TsRecursionStart,
> =
    IsAny<Full> extends true
        ? any
        : Depth extends TsTooMuchRecursion
          ? ['Error: recursive object depth is too deep.']
          : Full extends ReadonlyArray<infer FullChild extends AnyObject>
            ? SelectionSet<FullChild, TsRecurse<Depth>>
            : Partial<{
                  [Key in keyof Full]: IsNever<
                      Exclude<Full[Key], SelectionTypesToPreserve>
                  > extends true
                      ? boolean
                      : boolean | UnionToIntersection<SelectionSet<Full[Key], TsRecurse<Depth>>>;
              }>;

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
            } else {
                return selectFrom<any, any>(value, selection);
            }
        }),
        keysToRemove,
    ) as PickSelection<Full, Selection>;
}
