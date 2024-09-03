import {IsEmptyObject} from 'type-fest';

/**
 * Excludes empty objects from a union.
 *
 * @category Object : Common
 * @package @augment-vir/common
 */
export type ExcludeEmpty<T> = IsEmptyObject<T> extends true ? never : T;
