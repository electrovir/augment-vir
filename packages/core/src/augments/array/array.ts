/**
 * Extract the type of the elements in an array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ArrayElement<ArrayType extends ReadonlyArray<any>> = ArrayType[number];

/**
 * Either an array of `T` or just `T` itself.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see
 * - {@link MaybeReadonlyArray}: the readonly array version.
 */
export type MaybeArray<T> = T | T[];
/**
 * Either a readonly array of `T` or just `T` itself.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see
 * - {@link MaybeArray}: the non-readonly array version.
 */
export type MaybeReadonlyArray<T> = T | ReadonlyArray<T>;
