export type {ReadonlyDeep} from 'type-fest';

/**
 * This function does nothing but return the input as a readonly typed version of itself.
 *
 * @category Type : Common
 * @package @augment-vir/common
 */
export function makeReadonly<T>(input: T): Readonly<T> {
    return input;
}
