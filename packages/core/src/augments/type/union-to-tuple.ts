import {type ExcludeExactly} from './exclude-exactly.js';
import {type IsNever} from './type-checks.js';
import {type UnionMember} from './union-member.js';
import {type UnknownArray} from './unknown-array.js';

type UnionToTupleHelper<Union, Accumulator extends UnknownArray = [], Member = UnionMember<Union>> =
    IsNever<Union> extends true
        ? Accumulator
        : UnionToTupleHelper<
              ExcludeExactly<Union, Member>,
              [
                  Member,
                  ...Accumulator,
              ]
          >;

/**
 * Convert a union type into an unordered tuple type of its elements. The order of the resulting
 * tuple is not guaranteed.
 *
 * Copied from the `UnionToTuple` type in `type-fest` v5.6 so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type UnionToTuple<Union> =
    UnionToTupleHelper<Union> extends infer Result extends UnknownArray ? Result : never;
