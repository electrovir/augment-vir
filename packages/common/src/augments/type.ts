import {Except, Simplify} from 'type-fest';

/** Makes all properties in an object writable. This is the opposite of Readonly<> */
export type Writeable<T> = {-readonly [P in keyof T]: T[P]};

/** Makes all property values in an object also readonly. Can cause issues on primitive. */
export type DeepWriteable<T> = {-readonly [P in keyof T]: DeepWriteable<T[P]>};

/** Replace properties in T with properties in U. */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/** Extract the element type out of an array type. */
export type ArrayElement<ArrayType extends ReadonlyArray<any>> = ArrayType[number];

/**
 * Same as the Required<> built-in type helper but this requires that each property be present and
 * be not null.
 */
export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

export type SetOptionalAndNullable<
    OriginalObjectGeneric,
    OptionalKeysGeneric extends keyof OriginalObjectGeneric,
> = Simplify<
    Except<OriginalObjectGeneric, OptionalKeysGeneric> & {
        [PropKey in OptionalKeysGeneric]?: OriginalObjectGeneric[PropKey] | null | undefined;
    }
>;

/** Require only a subset of object properties. */
export type RequiredBy<T, K extends keyof T> = Overwrite<T, Required<Pick<T, K>>>;

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

export type UnPromise<T> = T extends PromiseLike<infer PromiseType> ? Awaited<PromiseType> : T;

/**
 * This function returns another function that simply returns whatever input it's given. However, it
 * also checks that the input matches the original wrapNarrowTypeWithTypeCheck's generic, while
 * maintaining strict "const" like typing.
 *
 * Use like this: wrapNarrowTypeWithTypeCheck<EnforcedTypeHere>()(valueToEnforceTypeOn as const)
 *
 * Sometimes "as const" isn't required, usually it is for any object or array though.
 */
export function wrapNarrowTypeWithTypeCheck<P>() {
    return <T extends P>(input: T): Readonly<T> => {
        return input;
    };
}

/**
 * This type helper is useful for forcing function generics to be explicitly provided, rather than
 * inferring them from the given inputs. See the test file for examples.
 */
export type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * This is a type helper that ensures the given input matches the given generic type. The generic is
 * setup in such a way that if it is omitted (which is typically allowed in TypeScript, resulting in
 * the generic being inferred from the inputs), there will actually be a type error. This forces
 * each usage of this function to explicitly specify the generic, thus giving us type safety for the
 * input.
 */
export function ensureType<ExpectedType = never>(
    input: NoInfer<ExpectedType>,
): NoInfer<ExpectedType> {
    return input;
}
