import {type IsNever} from './type-checks.js';
import {type UnionToIntersection} from './union-to-intersection.js';

/**
 * Returns a single member of the given union. Which member is returned is not guaranteed, but it is
 * deterministic for a given union.
 *
 * Copied from the `UnionMember` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type UnionMember<T> =
    IsNever<T> extends true
        ? never
        : UnionToIntersection<T extends any ? () => T : never> extends () => infer R
          ? R
          : never;
