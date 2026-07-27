import {type Except} from './except.js';
import {type Simplify} from './simplify.js';

type WritableArray<ArrayType extends readonly unknown[]> = ArrayType extends readonly []
    ? []
    : ArrayType extends readonly [
            ...infer U,
            infer V,
        ]
      ? [
            ...U,
            V,
        ]
      : ArrayType extends readonly [
              infer U,
              ...infer V,
          ]
        ? [
              U,
              ...V,
          ]
        : ArrayType extends ReadonlyArray<infer U>
          ? U[]
          : ArrayType;

/**
 * Create a type that strips `readonly` from the given type. Inverse of `Readonly<T>`.
 *
 * Copied from the `Writable` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Writable<BaseType, Keys extends keyof BaseType = keyof BaseType> =
    BaseType extends ReadonlyMap<infer KeyType, infer ValueType>
        ? Map<KeyType, ValueType>
        : BaseType extends ReadonlySet<infer ItemType>
          ? Set<ItemType>
          : BaseType extends readonly unknown[]
            ? WritableArray<BaseType>
            : Simplify<
                  Except<BaseType, Keys> & {
                      -readonly [KeyType in keyof Pick<BaseType, Keys>]: Pick<
                          BaseType,
                          Keys
                      >[KeyType];
                  }
              >;
