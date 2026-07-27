/**
 * Returns a boolean for whether the given type is `null`.
 *
 * Copied from the `IsNull` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsNull<T> = [T] extends [null] ? true : false;

/**
 * Returns a boolean for whether the given type is `unknown`.
 *
 * Copied from the `IsUnknown` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsUnknown<T> = unknown extends T ? (IsNull<T> extends false ? true : false) : false;
