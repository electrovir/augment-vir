import {type UnionToIntersection} from './union-to-intersection.js';

type LastOfUnion<Union> =
    UnionToIntersection<Union extends unknown ? () => Union : never> extends () => infer Last
        ? Last
        : never;

/**
 * Convert a union type into an unordered tuple type of its elements. The order of the resulting
 * tuple is not guaranteed.
 *
 * Copied from the `UnionToTuple` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type UnionToTuple<Union, Accumulator extends unknown[] = []> = [Union] extends [never]
    ? Accumulator
    : UnionToTuple<
          Exclude<Union, LastOfUnion<Union>>,
          [
              LastOfUnion<Union>,
              ...Accumulator,
          ]
      >;
