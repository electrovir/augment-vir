/* eslint-disable @typescript-eslint/no-empty-object-type -- faithful copy of type-fest, which intentionally uses the `{}` identity type. */
import {type BuiltIns, type HasMultipleCallSignatures} from './built-in-type.js';

type WritableMapDeep<MapType extends ReadonlyMap<unknown, unknown>> =
    MapType extends ReadonlyMap<infer KeyType, infer ValueType>
        ? Map<WritableDeep<KeyType>, WritableDeep<ValueType>>
        : MapType;

type WritableSetDeep<SetType extends ReadonlySet<unknown>> =
    SetType extends ReadonlySet<infer ItemType> ? Set<WritableDeep<ItemType>> : SetType;

type WritableObjectDeep<ObjectType extends object> = {
    -readonly [KeyType in keyof ObjectType]: WritableDeep<ObjectType[KeyType]>;
};

type WritableArrayDeep<ArrayType extends readonly unknown[]> = ArrayType extends readonly []
    ? []
    : ArrayType extends readonly [
            ...infer U,
            infer V,
        ]
      ? [
            ...WritableArrayDeep<U>,
            WritableDeep<V>,
        ]
      : ArrayType extends readonly [
              infer U,
              ...infer V,
          ]
        ? [
              WritableDeep<U>,
              ...WritableArrayDeep<V>,
          ]
        : ArrayType extends ReadonlyArray<infer U>
          ? Array<WritableDeep<U>>
          : ArrayType extends Array<infer U>
            ? Array<WritableDeep<U>>
            : ArrayType;

/**
 * Create a deeply mutable version of an `object`/`ReadonlyMap`/`ReadonlySet`/`ReadonlyArray` type.
 * The inverse of `ReadonlyDeep<T>`.
 *
 * Copied from the `WritableDeep` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type WritableDeep<T> = T extends BuiltIns
    ? T
    : T extends (...arguments_: any[]) => unknown
      ? {} extends WritableObjectDeep<T>
          ? T
          : HasMultipleCallSignatures<T> extends true
            ? T
            : ((...arguments_: Parameters<T>) => ReturnType<T>) & WritableObjectDeep<T>
      : T extends ReadonlyMap<unknown, unknown>
        ? WritableMapDeep<T>
        : T extends ReadonlySet<unknown>
          ? WritableSetDeep<T>
          : T extends readonly unknown[]
            ? WritableArrayDeep<T>
            : T extends object
              ? WritableObjectDeep<T>
              : unknown;
