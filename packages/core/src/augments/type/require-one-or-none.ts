import {type RequireExactlyOne} from './require-keys.js';

type RequireNone<KeysType extends PropertyKey> = Partial<Record<KeysType, never>>;

/**
 * Create a type that requires exactly one of the given keys or none of the given keys, while
 * keeping the remaining keys as is.
 *
 * Copied from the classic `RequireOneOrNone` implementation in the `type-fest` package (before
 * `type-fest` v5 wrapped it in an `IfNotAnyOrNever` conditional). See the note in
 * `type-checks.ts`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequireOneOrNone<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = (
    | RequireExactlyOne<ObjectType, KeysType>
    | RequireNone<KeysType>
) &
    Omit<ObjectType, KeysType>;
