import {type RequiredKeysOf} from '../object/required-keys.js';
import {type If, type IfNotAnyOrNever} from './conditional-type.js';
import {type Except} from './except.js';
import {type IsAny, type IsNever} from './type-checks.js';

/**
 * Returns `true` if the given object type has at least one required key, otherwise `false`.
 *
 * Copied from the `HasRequiredKeys` type in `type-fest` v5.6 (built on {@link RequiredKeysOf}) so
 * that this package's public types do not depend on `type-fest` (see the note in
 * `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type HasRequiredKeys<BaseType extends object> =
    RequiredKeysOf<BaseType> extends never ? false : true;

type RequireExactlyOneHelper<ObjectType, KeysType extends keyof ObjectType> = {
    [Key in KeysType]: Required<Pick<ObjectType, Key>> &
        Partial<Record<Exclude<KeysType, Key>, never>>;
}[KeysType] &
    Omit<ObjectType, KeysType>;

/**
 * Create a type that requires exactly one of the given keys and disallows the rest, while keeping
 * the remaining (non-listed) keys as is.
 *
 * Copied from the `RequireExactlyOne` type in `type-fest` v5.6 so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequireExactlyOne<
    ObjectType,
    KeysType extends keyof ObjectType = keyof ObjectType,
> = IfNotAnyOrNever<
    ObjectType,
    If<
        IsNever<KeysType>,
        never,
        RequireExactlyOneHelper<ObjectType, If<IsAny<KeysType>, keyof ObjectType, KeysType>>
    >
>;

type RequireAtLeastOneHelper<ObjectType, KeysType extends keyof ObjectType> = {
    [Key in KeysType]-?: Required<Pick<ObjectType, Key>> &
        Partial<Pick<ObjectType, Exclude<KeysType, Key>>>;
}[KeysType] &
    Except<ObjectType, KeysType>;

/**
 * Create a type that requires at least one of the given keys, while keeping the remaining
 * (non-listed) keys as is.
 *
 * Copied from the `RequireAtLeastOne` type in `type-fest` v5.6 so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequireAtLeastOne<
    ObjectType,
    KeysType extends keyof ObjectType = keyof ObjectType,
> = IfNotAnyOrNever<
    ObjectType,
    If<
        IsNever<KeysType>,
        never,
        RequireAtLeastOneHelper<ObjectType, If<IsAny<KeysType>, keyof ObjectType, KeysType>>
    >
>;
