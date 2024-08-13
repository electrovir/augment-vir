import {CompleteRequire} from '@augment-vir/core';
import {Except, Simplify} from 'type-fest';

export type {SetRequired} from 'type-fest';

/**
 * Same as the Required<> built-in type helper but this requires that each property be present and
 * be not null.
 */
export type RequiredAndNotNull<T> = {
    [P in keyof CompleteRequire<T>]-?: NonNullable<T[P]>;
};

/**
 * Require only a subset of object properties and require that they be not null. This is
 * particularly useful in conjunction with the "exactOptionalPropertyTypes" tsconfig flag.
 */
export type SetRequiredAndNotNull<T, K extends keyof T> = Omit<T, K> &
    CompleteRequire<{[PropertyName in K]: NonNullable<T[PropertyName]>}>;

export type SetOptionalAndNullable<
    OriginalObjectGeneric,
    OptionalKeysGeneric extends keyof OriginalObjectGeneric,
> = Simplify<
    Except<OriginalObjectGeneric, OptionalKeysGeneric> & {
        [PropKey in OptionalKeysGeneric]?: OriginalObjectGeneric[PropKey] | null | undefined;
    }
>;
