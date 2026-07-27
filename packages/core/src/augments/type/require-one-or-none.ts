import {type If, type IfNotAnyOrNever} from './conditional-type.js';
import {type RequireExactlyOne} from './require-keys.js';
import {type IsAny, type IsNever} from './type-checks.js';

type RequireNone<KeysType extends PropertyKey> = Partial<Record<KeysType, never>>;

type RequireOneOrNoneHelper<ObjectType, KeysType extends keyof ObjectType> = (
    | RequireExactlyOne<ObjectType, KeysType>
    | RequireNone<KeysType>
) &
    Omit<ObjectType, KeysType>;

/**
 * Create a type that requires exactly one of the given keys or none of the given keys, while
 * keeping the remaining keys as is.
 *
 * Copied from the `RequireOneOrNone` type in `type-fest` v5.6 so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RequireOneOrNone<
    ObjectType,
    KeysType extends keyof ObjectType = keyof ObjectType,
> = IfNotAnyOrNever<
    ObjectType,
    If<
        IsNever<KeysType>,
        ObjectType,
        RequireOneOrNoneHelper<ObjectType, If<IsAny<KeysType>, keyof ObjectType, KeysType>>
    >
>;
