import {type RequiredKeysOf} from '../object/required-keys.js';

/**
 * Returns `true` if the given object type has at least one required key, otherwise `false`.
 *
 * Copied from the `HasRequiredKeys` type in the `type-fest` package (built on
 * {@link RequiredKeysOf}) so that this package's public types do not depend on `type-fest` (see the
 * note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type HasRequiredKeys<BaseType> = [RequiredKeysOf<BaseType>] extends [never] ? false : true;

/**
 * Create a type that requires exactly one of the given keys and disallows the rest, while keeping
 * the remaining (non-listed) keys as is.
 *
 * Copied from the classic `RequireExactlyOne` implementation in the `type-fest` package (before
 * `type-fest` v5 wrapped it in an `IfNotAnyOrNever` conditional that breaks structural
 * assignability). See the note in `type-checks.ts`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequireExactlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = {
    [Key in KeysType]: Required<Pick<ObjectType, Key>> &
        Partial<Record<Exclude<KeysType, Key>, never>>;
}[KeysType] &
    Omit<ObjectType, KeysType>;

/**
 * Create a type that requires at least one of the given keys, while keeping the remaining
 * (non-listed) keys as is.
 *
 * Copied from the classic `RequireAtLeastOne` implementation in the `type-fest` package (before
 * `type-fest` v5 wrapped it in an `IfNotAnyOrNever` conditional). See the note in
 * `type-checks.ts`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = {
    [Key in KeysType]-?: Required<Pick<ObjectType, Key>> &
        Partial<Pick<ObjectType, Exclude<KeysType, Key>>>;
}[KeysType] &
    Omit<ObjectType, KeysType>;
