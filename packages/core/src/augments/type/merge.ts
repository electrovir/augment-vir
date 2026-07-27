import {type If} from './conditional-type.js';
import {type OmitIndexSignature, type PickIndexSignature} from './omit-index-signature.js';
import {type Simplify} from './simplify.js';
import {type IsEqual} from './type-checks.js';

type SimpleMerge<Destination, Source> = Simplify<
    {
        [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
    } & Source
>;

type MergeNonEqual<Destination, Source> = Simplify<
    SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> &
        SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;

/**
 * Merge two types into a new type. Keys of the second type override keys of the first type.
 *
 * Copied from the `Merge` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Merge<Destination, Source> = Destination extends unknown
    ? Source extends unknown
        ? If<IsEqual<Destination, Source>, Destination, MergeNonEqual<Destination, Source>>
        : never
    : never;
