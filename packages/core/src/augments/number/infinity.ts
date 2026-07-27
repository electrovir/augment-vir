/**
 * Matches the hidden `Infinity` type.
 *
 * Copied from the `PositiveInfinity` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
// eslint-disable-next-line no-loss-of-precision
export type PositiveInfinity = 1e999;

/**
 * Matches the hidden `-Infinity` type.
 *
 * Copied from the `NegativeInfinity` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
// eslint-disable-next-line no-loss-of-precision
export type NegativeInfinity = -1e999;
