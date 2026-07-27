import {type If} from './conditional-type.js';
import {type Except} from './except.js';
import {type KeysOfUnion} from './keys-of-union.js';
import {type OptionalKeysOf} from './optional-keys-of.js';
import {type Simplify} from './simplify.js';
import {type IsNever} from './type-checks.js';
import {type UnknownArray} from './unknown-array.js';

type HomomorphicPick<T, Keys extends KeysOfUnion<T>> = {
    [P in keyof T as Extract<P, Keys>]: T[P];
};

type IsArrayReadonly<T extends UnknownArray> = If<
    IsNever<T>,
    false,
    T extends unknown[] ? false : true
>;

/** Remove the optional modifier from the specified keys in an array. */
type SetArrayRequired<
    TArray extends UnknownArray,
    Keys,
    Counter extends any[] = [],
    Accumulator extends UnknownArray = [],
> = TArray extends unknown
    ? keyof TArray & `${number}` extends never
        ? [
              ...Accumulator,
              ...TArray,
          ]
        : TArray extends readonly [
                (infer First)?,
                ...infer Rest,
            ]
          ? '0' extends OptionalKeysOf<TArray>
              ? `${Counter['length']}` extends `${Keys & (string | number)}`
                  ? SetArrayRequired<
                        Rest,
                        Keys,
                        [
                            ...Counter,
                            any,
                        ],
                        [
                            ...Accumulator,
                            First,
                        ]
                    >
                  : [
                        ...Accumulator,
                        ...TArray,
                    ]
              : SetArrayRequired<
                    Rest,
                    Keys,
                    [
                        ...Counter,
                        any,
                    ],
                    [
                        ...Accumulator,
                        TArray[0],
                    ]
                >
          : never
    : never;

type _SetRequired<BaseType, Keys extends keyof BaseType> = BaseType extends UnknownArray
    ? SetArrayRequired<BaseType, Keys> extends infer ResultantArray
        ? If<IsArrayReadonly<BaseType>, Readonly<ResultantArray>, ResultantArray>
        : never
    : Simplify<Except<BaseType, Keys> & Required<HomomorphicPick<BaseType, Keys>>>;

/**
 * Create a type that makes the given keys required, while keeping the remaining keys as is.
 *
 * Copied from the `SetRequired` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type SetRequired<BaseType, Keys extends keyof BaseType> = (BaseType extends (
    ...arguments_: never
) => any
    ? (...arguments_: Parameters<BaseType>) => ReturnType<BaseType>
    : unknown) &
    _SetRequired<BaseType, Keys>;
