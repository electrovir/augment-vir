/** Makes all properties in an object writable. This is the opposite of Readonly<> */
export type Writeable<T> = {-readonly [P in keyof T]: T[P]};

/** Makes all property values in an object also readonly. Can cause issues on primitive. */
export type DeepWriteable<T> = {-readonly [P in keyof T]: DeepWriteable<T[P]>};

/** Replace properties in T with properties in U. */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/** Extract the element type out of an array type. */
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

/**
 * Same as the Required<> built-in type helper but this requires that each property be present and
 * be not null.
 */
export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

/** Require only a subset of object properties. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Require only a subset of object properties and require that they be not null. This is
 * particularly useful in conjunction with the "exactOptionalPropertyTypes" tsconfig flag.
 */
export type RequiredAndNotNullBy<T, K extends keyof T> = Omit<T, K> &
    Required<{[PropertyName in K]: NonNullable<T[PropertyName]>}>;

/** If type T = type U, then type Y. Else type N. */
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
    G,
>() => G extends U ? 1 : 2
    ? Y
    : N;
