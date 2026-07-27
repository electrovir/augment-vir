/* eslint-disable @typescript-eslint/no-empty-object-type -- faithful copy of type-fest, which intentionally uses the `{}` identity type. */
import {type ApplyDefaultOptions} from './apply-default-options.js';
import {type BuiltIns, type HasMultipleCallSignatures} from './built-in-type.js';
import {type IsNever} from './type-checks.js';

/**
 * Options for {@link PartialDeep}.
 *
 * Copied from the `PartialDeepOptions` type in the `type-fest` package so that this package's
 * public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PartialDeepOptions = {
    /**
     * Whether to affect the individual elements of arrays and tuples.
     *
     * @default false
     */
    readonly recurseIntoArrays?: boolean;

    /**
     * Allows `undefined` values in non-tuple arrays.
     *
     * @default false
     */
    readonly allowUndefinedInNonTupleArrays?: boolean;
};

type DefaultPartialDeepOptions = {
    recurseIntoArrays: false;
    allowUndefinedInNonTupleArrays: false;
};

type PartialMapDeep<KeyType, ValueType, Options extends Required<PartialDeepOptions>> = {} & Map<
    PartialDeepHelper<KeyType, Options>,
    PartialDeepHelper<ValueType, Options>
>;

type PartialSetDeep<T, Options extends Required<PartialDeepOptions>> = {} & Set<
    PartialDeepHelper<T, Options>
>;

type PartialReadonlyMapDeep<
    KeyType,
    ValueType,
    Options extends Required<PartialDeepOptions>,
> = {} & ReadonlyMap<PartialDeepHelper<KeyType, Options>, PartialDeepHelper<ValueType, Options>>;

type PartialReadonlySetDeep<T, Options extends Required<PartialDeepOptions>> = {} & ReadonlySet<
    PartialDeepHelper<T, Options>
>;

type PartialObjectDeep<ObjectType extends object, Options extends Required<PartialDeepOptions>> = {
    [KeyType in keyof ObjectType]?: PartialDeepHelper<ObjectType[KeyType], Options>;
};

/**
 * Create a deeply optional version of another type. Use `Partial<T>` if you only need one level
 * deep.
 *
 * Copied from the `PartialDeep` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PartialDeep<T, Options extends PartialDeepOptions = {}> = PartialDeepHelper<
    T,
    ApplyDefaultOptions<PartialDeepOptions, DefaultPartialDeepOptions, Options>
>;

type PartialDeepHelper<T, Options extends Required<PartialDeepOptions>> = T extends
    | BuiltIns
    | (new (...arguments_: any[]) => unknown)
    ? T
    : T extends Map<infer KeyType, infer ValueType>
      ? PartialMapDeep<KeyType, ValueType, Options>
      : T extends Set<infer ItemType>
        ? PartialSetDeep<ItemType, Options>
        : T extends ReadonlyMap<infer KeyType, infer ValueType>
          ? PartialReadonlyMapDeep<KeyType, ValueType, Options>
          : T extends ReadonlySet<infer ItemType>
            ? PartialReadonlySetDeep<ItemType, Options>
            : T extends (...arguments_: any[]) => unknown
              ? IsNever<keyof T> extends true
                  ? T
                  : HasMultipleCallSignatures<T> extends true
                    ? T
                    : ((...arguments_: Parameters<T>) => ReturnType<T>) &
                          PartialObjectDeep<T, Options>
              : T extends object
                ? T extends ReadonlyArray<infer ItemType>
                    ? Options['recurseIntoArrays'] extends true
                        ? ItemType[] extends T
                            ? readonly ItemType[] extends T
                                ? ReadonlyArray<
                                      PartialDeepHelper<
                                          Options['allowUndefinedInNonTupleArrays'] extends false
                                              ? ItemType
                                              : ItemType | undefined,
                                          Options
                                      >
                                  >
                                : Array<
                                      PartialDeepHelper<
                                          Options['allowUndefinedInNonTupleArrays'] extends false
                                              ? ItemType
                                              : ItemType | undefined,
                                          Options
                                      >
                                  >
                            : PartialObjectDeep<T, Options>
                        : T
                    : PartialObjectDeep<T, Options>
                : unknown;
