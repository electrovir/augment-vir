import {type IsAny, type IsEqual} from './type-checks.js';

type IsReadonlyKeyOf<Type extends object, Key extends keyof Type> =
    IsAny<Type | Key> extends true
        ? never
        : Key extends unknown
          ? Type extends unknown
              ? IsEqual<
                    {
                        [K in Key]: Type[Key];
                    },
                    {
                        readonly [K in Key]: Type[Key];
                    }
                >
              : never
          : never;

/**
 * Extract all readonly keys from the given type.
 *
 * Copied from the `ReadonlyKeysOf` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ReadonlyKeysOf<Type extends object> = Type extends unknown
    ? keyof {
          [Key in keyof Type as IsReadonlyKeyOf<Type, Key> extends false ? never : Key]: never;
      } &
          keyof Type
    : never;
