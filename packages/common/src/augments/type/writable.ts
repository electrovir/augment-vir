import {type Writable} from '@augment-vir/core';

/**
 * This function does nothing but return the input as a writable typed version of itself.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function makeWritable<T>(input: T): Writable<T> {
    return input as Writable<T>;
}
