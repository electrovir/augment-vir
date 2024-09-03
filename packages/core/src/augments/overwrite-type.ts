/**
 * Replace properties in T with properties in U.
 *
 * @category Type : Common
 * @package @augment-vir/common
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
