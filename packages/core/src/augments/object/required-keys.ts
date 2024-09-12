import {Except, Simplify} from 'type-fest';

export type {SetRequired} from 'type-fest';

/**
 * Same as the Required<> built-in type helper but this requires that each property be present and
 * be not null.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequiredAndNotNull<T> = {
    [P in keyof CompleteRequire<T>]-?: NonNullable<T[P]>;
};

/**
 * Require only a subset of object properties and require that they be not null. This is
 * particularly useful in conjunction with the "exactOptionalPropertyTypes" tsconfig flag.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type SetRequiredAndNotNull<T, K extends keyof T> = Omit<T, K> &
    CompleteRequire<{[PropertyName in K]: NonNullable<T[PropertyName]>}>;

/**
 * Sets a key as optional but also nullable.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type SetOptionalAndNullable<
    OriginalObjectGeneric,
    OptionalKeysGeneric extends keyof OriginalObjectGeneric,
> = Simplify<
    Except<OriginalObjectGeneric, OptionalKeysGeneric> & {
        [PropKey in OptionalKeysGeneric]?: OriginalObjectGeneric[PropKey] | null | undefined;
    }
>;

/**
 * Modified version of `RequiredKeys` from `type-fest` that does not require `BaseType` to extends
 * `object`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequiredKeysOf<BaseType> = Exclude<
    {
        [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]> ? Key : never;
    }[keyof BaseType],
    undefined
>;

/**
 * Requires every part of an object, even the indexed keys. This is needed because
 * `Required<Partial<T>>` doesn't fully remove `| undefined` from indexed keys when the
 * `noUncheckedIndexedAccess` TSConfig compiler option is enabled.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type CompleteRequire<Parent> = {
    [Prop in keyof Parent]-?: Parent extends Partial<Record<Prop, infer V>> ? V : never;
};
