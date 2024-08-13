import {AnyObject} from '@augment-vir/assert';
import {isPrimitive} from 'run-time-assertions';
import {IsAny, IsNever, Primitive, UnionToIntersection} from 'type-fest';
import {
    TsRecurse,
    TsRecursionStart,
    TsRecursionTracker,
    TsTooMuchRecursion,
} from '../type/type-recursion.js';

export function shouldPreserveInSelectionSet(input: unknown): input is SelectionTypesToPreserve {
    return isPrimitive(input) || input instanceof RegExp || input instanceof Promise;
}

/** All types that won't be recursed into when defining a {@link SelectionSet}. */
export type SelectionTypesToPreserve = Primitive | RegExp | Promise<any>;

/** A generic selection set without specific keys. */
export type GenericSelectionSet = {
    [Key in PropertyKey]: unknown;
};

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

/** Defines a selection set for the given object. */
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
