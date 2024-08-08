/** Extract the element type out of an array type. */
export type ArrayElement<ArrayType extends ReadonlyArray<any>> = ArrayType[number];

export type MaybeArray<T> = T | T[];
export type MaybeReadonlyArray<T> = T | ReadonlyArray<T>;
