/**
 * These type predicates are copied from the `type-fest` package rather than imported from it.
 * Owning them here keeps `@augment-vir` (and its consumers) decoupled from `type-fest`'s evolving
 * internals: `type-fest` v5 started wrapping several of its utility types in an `IfNotAnyOrNever`
 * conditional that breaks structural assignability and narrowing, and because those utilities leak
 * through the public `.d.ts` of downstream packages, a `type-fest` upgrade could silently break
 * consumers. These local copies use only built-in types so they never reference `type-fest`.
 */

/**
 * Returns `true` if the two given types are exactly equal, otherwise `false`.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsEqual<A, B> =
    (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2 ? true : false;

/**
 * Returns `true` if the given type is `never`, otherwise `false`.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Returns `true` if the given type is `any`, otherwise `false`.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;
