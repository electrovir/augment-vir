export type {ReadonlyDeep} from 'type-fest';

/**
 * This function does nothing but return the input as a readonly typed version of itself.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function makeReadonly<T>(input: T): Readonly<T> {
    return input;
}
