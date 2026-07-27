/**
 * Represents an array with `unknown` values. Any array can be assigned to this type.
 *
 * Copied from the `UnknownArray` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type UnknownArray = readonly unknown[];
