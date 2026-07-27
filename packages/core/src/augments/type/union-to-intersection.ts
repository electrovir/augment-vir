/**
 * Convert a union type to an intersection type.
 *
 * Copied from the `UnionToIntersection` type in the `type-fest` package so that this package's
 * public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type UnionToIntersection<Union> = (
    Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
    ? Intersection & Union
    : never;
