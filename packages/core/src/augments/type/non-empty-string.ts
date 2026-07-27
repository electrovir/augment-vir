/**
 * Blocks empty string literal types. Use this to constrain a string type parameter so that the
 * empty string is rejected.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type NonEmptyString<T> = T extends '' ? never : T;
