/**
 * Create a type that represents either the value or the value wrapped in `PromiseLike`.
 *
 * Copied from the `Promisable` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Async
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Promisable<T> = T | PromiseLike<T>;
