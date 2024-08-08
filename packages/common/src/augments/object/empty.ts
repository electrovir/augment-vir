import {IsEmptyObject} from 'type-fest';

/** Excludes empty objects from a union. */
export type ExcludeEmpty<T> = IsEmptyObject<T> extends true ? never : T;
