declare const emptyObjectSymbol: unique symbol;

/**
 * Represents a strictly empty plain object, the `{}` value.
 *
 * Copied from the `EmptyObject` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type EmptyObject = {[emptyObjectSymbol]?: never};

/**
 * Returns a boolean for whether the type is strictly equal to an empty plain object, the `{}`
 * value.
 *
 * Copied from the `IsEmptyObject` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsEmptyObject<T> = T extends EmptyObject ? true : false;
