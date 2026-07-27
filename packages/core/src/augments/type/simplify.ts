/**
 * Flattens the type output to improve type hints shown in editors. Also transforms an interface
 * into a type to aid with assignability.
 *
 * Copied from the `Simplify` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};
