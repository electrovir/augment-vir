import {type IsAny} from './type-checks.js';

/**
 * Returns a boolean for whether the given key is an optional key of the given type.
 *
 * Copied from the `IsOptionalKeyOf` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsOptionalKeyOf<Type extends object, Key extends keyof Type> =
    IsAny<Type | Key> extends true
        ? never
        : Key extends keyof Type
          ? Type extends Record<Key, Type[Key]>
              ? false
              : true
          : false;

/**
 * Extract all optional keys from the given type.
 *
 * Copied from the `OptionalKeysOf` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type OptionalKeysOf<Type extends object> = Type extends unknown
    ? keyof {
          [Key in keyof Type as IsOptionalKeyOf<Type, Key> extends false ? never : Key]: never;
      } &
          keyof Type
    : never;
