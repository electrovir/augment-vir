/**
 * This is the version of UnionToIntersection from type-fest v4.3.3. In version 4.4.0 type-fest
 * changed this type helper and it broke how we're using it.
 */
export type UnionToIntersection<Union> =
    // `extends unknown` is always going to be the case and is used to convert the
    // `Union` into a [distributive conditional
    // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
    (
        Union extends unknown
            ? // The union type is used as the only argument to a function since the union
              // of function arguments is an intersection.
              (distributedUnion: Union) => void
            : // This won't happen.
              never
    ) extends // Infer the `Intersection` type since TypeScript represents the positional
    // arguments of unions of functions as an intersection of the union.
    (mergedIntersection: infer Intersection) => void
        ? // The `& Union` is to allow indexing by the resulting type
          Intersection
        : never;
