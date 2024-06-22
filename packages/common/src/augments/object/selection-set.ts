import {IsNever, Primitive} from 'type-fest';
import {
    TsRecurse,
    TsRecursionStart,
    TsRecursionTracker,
    TsTooMuchRecursion,
} from '../type-recursion';
import {UnionToIntersection} from '../union';
import {AnyObject} from './any-object';
import {KeyCount} from './key-count';
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
            [Key in keyof Selection as Selection[Key] extends false
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
> = Depth extends TsTooMuchRecursion
    ? ['Error: recursive object depth is too deep.']
    : Full extends ReadonlyArray<infer FullChild extends AnyObject>
      ? SelectionSet<FullChild, TsRecurse<Depth>>
      : Partial<{
            [Key in keyof Full]: IsNever<Exclude<Full[Key], SelectionTypesToPreserve>> extends true
                ? boolean
                : boolean | UnionToIntersection<SelectionSet<Full[Key], TsRecurse<Depth>>>;
        }>;
