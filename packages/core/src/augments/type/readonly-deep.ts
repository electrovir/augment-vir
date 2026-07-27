/* eslint-disable @typescript-eslint/no-empty-object-type -- faithful copy of type-fest, which intentionally uses the `{}` identity type. */
import {type BuiltIns, type HasMultipleCallSignatures} from './built-in-type.js';

type ReadonlyMapDeep<KeyType, ValueType> = {} & Readonly<
    ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>
>;

type ReadonlySetDeep<ItemType> = {} & Readonly<ReadonlySet<ReadonlyDeep<ItemType>>>;

type ReadonlyObjectDeep<ObjectType extends object> = {
    readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>;
};

/**
 * Create a deeply immutable version of another type.
 *
 * Copied from the `ReadonlyDeep` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ReadonlyDeep<T> = T extends BuiltIns
    ? T
    : T extends new (...arguments_: any[]) => unknown
      ? T
      : T extends (...arguments_: any[]) => unknown
        ? {} extends ReadonlyObjectDeep<T>
            ? T
            : HasMultipleCallSignatures<T> extends true
              ? T
              : ((...arguments_: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T>
        : T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
          ? ReadonlyMapDeep<KeyType, ValueType>
          : T extends Readonly<ReadonlySet<infer ItemType>>
            ? ReadonlySetDeep<ItemType>
            : T extends readonly [] | readonly [...never[]]
              ? readonly []
              : T extends readonly [
                      infer U,
                      ...infer V,
                  ]
                ? readonly [
                      ReadonlyDeep<U>,
                      ...ReadonlyDeep<V>,
                  ]
                : T extends readonly [
                        ...infer U,
                        infer V,
                    ]
                  ? readonly [
                        ...ReadonlyDeep<U>,
                        ReadonlyDeep<V>,
                    ]
                  : T extends ReadonlyArray<infer ItemType>
                    ? ReadonlyArray<ReadonlyDeep<ItemType>>
                    : T extends object
                      ? ReadonlyObjectDeep<T>
                      : unknown;
