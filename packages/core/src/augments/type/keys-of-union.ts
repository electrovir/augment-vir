import {type UnionToIntersection} from './union-to-intersection.js';

/**
 * Create a union of all keys from a given type, even those exclusive to specific union members.
 * Unlike the native `keyof` keyword, which returns keys present in _all_ union members, this type
 * returns keys from _any_ member.
 *
 * Copied from the `KeysOfUnion` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type KeysOfUnion<ObjectType> = keyof UnionToIntersection<
    ObjectType extends unknown ? Record<keyof ObjectType, never> : never
>;
