import type {IsEqual} from 'type-fest';

/** If type T = type U, then type Y. Else type N. */
export type IfEquals<T, U, Y = unknown, N = never> = IsEqual<T, U> extends true ? Y : N;
