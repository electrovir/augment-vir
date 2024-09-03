import type {AnyObject} from '@augment-vir/core';
import {IsAny, IsNever, Primitive, UnionToIntersection} from 'type-fest';
import {
    TsRecurse,
    TsRecursionStart,
    TsRecursionTracker,
    TsTooMuchRecursion,
} from '../type/type-recursion.js';

/** All types that won't be recursed into when defining a {@link SelectionSet}. */
type SelectionTypesToPreserve = Primitive | RegExp | Promise<any>;

/**
 * A generic selection set without specific keys. Useful for type parameter baselines.
 *
 * @category Selection
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type GenericSelectionSet = {
    [Key in PropertyKey]: unknown;
};

/**
 * Performs a SQL-like nested selection on an object, extracting the selected values. This produces
 * the output type for `selectFrom`.
 *
 * @category Selection
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type SelectFrom<
    Full extends Readonly<AnyObject>,
    Selection extends SelectionSet<Full>,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? ['Error: recursive object depth is too deep.']
    : Full extends ReadonlyArray<infer Element extends any>
      ? (
            | SelectFrom<Extract<Element, AnyObject>, Selection, TsRecurse<Depth>>
            | Exclude<Element, AnyObject>
        )[]
      : {
            -readonly [Key in keyof Selection as Selection[Key] extends false
                ? never
                : Key extends keyof Full
                  ? Key
                  : never]:
                | (Selection[Key] extends GenericSelectionSet
                      ? SelectFrom<
                            NonNullable<Extract<Full[Key], AnyObject>>,
                            Selection[Key],
                            TsRecurse<Depth>
                        >
                      : Full[Key])
                | Exclude<Full[Key], AnyObject>;
        };

/**
 * Defines a selection set for a given object type. This is used in {@link SelectFrom}.
 *
 * @category Selection
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type SelectionSet<
    Full extends Readonly<AnyObject>,
    Depth extends TsRecursionTracker = TsRecursionStart,
> =
    IsAny<Full> extends true
        ? any
        : Depth extends TsTooMuchRecursion
          ? boolean
          : Full extends ReadonlyArray<infer FullChild extends AnyObject>
            ? SelectionSet<FullChild, TsRecurse<Depth>>
            : Partial<{
                  [Key in keyof Full]: IsNever<
                      Exclude<Full[Key], SelectionTypesToPreserve>
                  > extends true
                      ? boolean
                      :
                            | UnionToIntersection<
                                  SelectionSet<NonNullable<Required<Full>[Key]>, TsRecurse<Depth>>
                              >
                            | boolean;
              }>;
