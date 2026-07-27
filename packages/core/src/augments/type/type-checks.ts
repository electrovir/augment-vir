/**
 * These type predicates are copied from `type-fest` v5.6 rather than imported from it. Owning them
 * here keeps `@augment-vir` (and its consumers) decoupled from `type-fest`'s evolving internals:
 * these utilities leak through the public `.d.ts` of downstream packages, so a `type-fest` upgrade
 * could otherwise silently break consumers. These local copies use only built-in types so they
 * never reference `type-fest`.
 */

type IsEqualHelper<A, B> =
    (<G>() => G extends (A & G) | G ? 1 : 2) extends <G>() => G extends (B & G) | G ? 1 : 2
        ? true
        : false;

/**
 * Returns `true` if the two given types are exactly equal, otherwise `false`.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsEqual<A, B> = [A] extends [B]
    ? [B] extends [A]
        ? IsEqualHelper<A, B>
        : false
    : false;

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
export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
