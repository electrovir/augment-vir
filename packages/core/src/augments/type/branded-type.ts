/**
 * A symbol used for {@link Branded}.
 *
 * @category Internal
 */
export const brandedTypeTag = Symbol.for('augment-vir-core-branded-type-tag');

/**
 * Brand any type so that it is no longer assignable to itself. For example, brand a database id
 * `string` type so that standard strings cannot be assigned to it.
 *
 * Largely inspired by the `Tagged` type from the `type-fest` package at
 * https://github.com/sindresorhus/type-fest/tree/687a89d94c4403d93ac5cb969ac7f492cee006cb/source
 *
 * @category Type
 * @example
 *
 * ```ts
 * import {Branded, createBrander} from '@augment-vir/common';
 *
 * type MyId = Branded<string, 'my-database-id-type'>;
 * ```
 */
export type Branded<
    OriginalType,
    /** The key for this brand. Two branded types with the same key will be assignable to each other. */
    BrandKey extends PropertyKey,
> = OriginalType &
    Readonly<{
        [brandedTypeTag]: Record<BrandKey, never>;
    }>;

/**
 * Unwrap a type brand applied via {@link Branded}.
 *
 * Largely inspired by the `Tagged` type from the `type-fest` package at
 * https://github.com/sindresorhus/type-fest/tree/687a89d94c4403d93ac5cb969ac7f492cee006cb/source
 *
 * @category Type
 */
export type UnwrapBrand<BrandedType extends Branded<any, any>> =
    BrandedType extends Branded<infer OriginalType, any> ? OriginalType : BrandedType;

/**
 * Wrap a value in a brand that matches its original type.
 *
 * @category Type
 */
export function applyBrand<Brand extends Branded<any, any>>(value: UnwrapBrand<Brand>): Brand {
    return value as Brand;
}
