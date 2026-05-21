/**
 * Property key used to mark {@link Branded}.
 *
 * @category Internal
 */
export type BrandedTypeTag = '$_brand_$';

/**
 * Applies a branding to types for {@link Branded}.
 *
 * @category Internal
 */
export type Brand<BrandKey extends PropertyKey> = Readonly<
    Record<BrandedTypeTag, Record<BrandKey, never>>
>;

/**
 * Brand any type so that it is no longer assignable to itself. For example, brand a database id
 * `string` type so that standard strings cannot be assigned to it.
 *
 * Largely inspired by the `Tagged` type from the `type-fest` package at
 * https://github.com/sindresorhus/type-fest/blob/687a89d94c4403d93ac5cb969ac7f492cee006cb/source/tagged.d.ts
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
> = OriginalType & Brand<BrandKey>;

/**
 * Unwrap a type brand applied via {@link Branded}.
 *
 * Largely inspired by the `Tagged` type from the `type-fest` package at
 * https://github.com/sindresorhus/type-fest/blob/687a89d94c4403d93ac5cb969ac7f492cee006cb/source/tagged.d.ts
 *
 * @category Type
 */
export type UnwrapBrand<BrandedType extends Branded<any, any>> = RemoveAllBranding<BrandedType>;

/**
 * Removes all branding for {@link UnwrapBrand}.
 *
 * Largely inspired by the `RemoveAllTags` type from the `type-fest` package at
 * https://github.com/sindresorhus/type-fest/blob/687a89d94c4403d93ac5cb969ac7f492cee006cb/source/tagged.d.ts
 *
 * @category Internal
 */
export type RemoveAllBranding<T> =
    T extends Brand<any>
        ? {
              [ThisBrand in keyof T[BrandedTypeTag]]: T extends Branded<
                  infer OriginalType,
                  ThisBrand
              >
                  ? RemoveAllBranding<OriginalType>
                  : never;
          }[keyof T[BrandedTypeTag]]
        : T;

/**
 * Wrap a value in a brand that matches its original type.
 *
 * @category Type
 */
export function applyBrand<
    const NewBrand extends Branded<any, any> = Branded<
        '__type_param_required__',
        '__type_param_required__'
    >,
>(value: UnwrapBrand<NewBrand>): NoInfer<NewBrand>;
export function applyBrand<
    const NewBrand extends Branded<any, any> = Branded<
        '__type_param_required__',
        '__type_param_required__'
    >,
>(value: UnwrapBrand<NewBrand> | undefined): NoInfer<NewBrand> | undefined;
export function applyBrand<
    const NewBrand extends Branded<any, any> = Branded<
        '__type_param_required__',
        '__type_param_required__'
    >,
>(value: UnwrapBrand<NewBrand> | null): NoInfer<NewBrand> | null;
export function applyBrand<
    const NewBrand extends Branded<any, any> = Branded<
        '__type_param_required__',
        '__type_param_required__'
    >,
>(value: UnwrapBrand<NewBrand> | undefined | null): NoInfer<NewBrand> | undefined | null;
export function applyBrand<
    const NewBrand extends Branded<any, any> = Branded<
        '__type_param_required__',
        '__type_param_required__'
    >,
>(value: UnwrapBrand<NewBrand> | undefined | null): NoInfer<NewBrand> | undefined | null {
    return value as NewBrand;
}
