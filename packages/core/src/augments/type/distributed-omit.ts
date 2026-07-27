import {type KeysOfUnion} from './keys-of-union.js';

/**
 * Omits keys from a type, distributing the operation over a union. Unlike the built-in `Omit`, this
 * retains member-specific properties of each union member.
 *
 * Copied from the `DistributedOmit` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type DistributedOmit<
    ObjectType,
    KeyType extends KeysOfUnion<ObjectType>,
> = ObjectType extends unknown ? Omit<ObjectType, KeyType> : never;
