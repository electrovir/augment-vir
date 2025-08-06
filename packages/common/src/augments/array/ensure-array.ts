/**
 * Wraps the input in an array if it isn't already an array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function ensureArray<T>(input: T | T[]): T[];
/**
 * Wraps the input in an array if it isn't already an array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function ensureArray<T>(input: T | ReadonlyArray<T>): ReadonlyArray<T>;

/**
 * Wraps the input in an array if it isn't already an array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function ensureArray<T>(input: T | ReadonlyArray<T> | T[]): T[] | ReadonlyArray<T> {
    if (Array.isArray(input)) {
        return input;
    } else {
        return [input as T];
    }
}
