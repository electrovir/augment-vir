import {type If, type IfNotAnyOrNever} from './conditional-type.js';
import {type IsAny, type IsEqual, type IsNever} from './type-checks.js';

type ExcludeExactlyMember<Union, Delete> = IfNotAnyOrNever<
    Delete,
    Union extends unknown
        ? [
              Delete extends unknown ? If<IsEqual<Union, Delete>, true, never> : never,
          ] extends [never]
            ? Union
            : never
        : never,
    /**
     * When `Delete` is `any` or `never`, return `Union`, because `Union` cannot be `any` or `never`
     * here.
     */
    Union,
    Union
>;

/**
 * Exclude exactly the given type from a union, instead of excluding every member assignable to it
 * the way the built-in `Exclude` does.
 *
 * Copied from the `ExcludeExactly` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExcludeExactly<Union, Delete> = IfNotAnyOrNever<
    Union,
    ExcludeExactlyMember<Union, Delete>,
    /** When `Union` is `any`: if `Delete` is `any` return `never`, otherwise return `Union`. */
    If<IsAny<Delete>, never, Union>,
    /** When `Union` is `never`: if `Delete` is `never` return `never`, otherwise return `Union`. */
    If<IsNever<Delete>, never, Union>
>;
