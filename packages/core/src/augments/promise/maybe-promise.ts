/**
 * Either a Promise of `T` or just `T` itself.
 *
 * @category Promise : Common
 * @package @augment-vir/common
 */
export type MaybePromise<T> = Promise<T> | T;
