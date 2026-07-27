import {type IsAny, type IsNever} from './type-checks.js';

/**
 * An if-else-like type that resolves depending on whether the given `boolean` type is `true` or
 * `false`. Returns the else branch when the given type is `never`.
 *
 * Copied from the `If` type in the `type-fest` package so that this package's public types do not
 * depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type If<Type extends boolean, IfBranch, ElseBranch> =
    IsNever<Type> extends true ? ElseBranch : Type extends true ? IfBranch : ElseBranch;

/**
 * Resolves to `IfNotAnyOrNeverBranch` unless the given type is `any` or `never`, in which case the
 * respective `IfAny` or `IfNever` branch is used.
 *
 * Copied from the `IfNotAnyOrNever` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IfNotAnyOrNever<Type, IfNotAnyOrNeverBranch, IfAny = any, IfNever = never> = If<
    IsAny<Type>,
    IfAny,
    If<IsNever<Type>, IfNever, IfNotAnyOrNeverBranch>
>;
