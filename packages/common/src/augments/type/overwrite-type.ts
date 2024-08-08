/** Replace properties in T with properties in U. */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
