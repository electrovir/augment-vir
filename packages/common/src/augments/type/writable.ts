import type {Writable} from 'type-fest';

export type {Writable, WritableDeep} from 'type-fest';

/**
 * This function does nothing but return the input as a writable typed version of itself.
 *
 * @category Type : Common
 * @package @augment-vir/common
 */
export function makeWritable<T>(input: T): Writable<T> {
    return input as Writable<T>;
}
