import {type Except} from './except.js';
import {type KeysOfUnion} from './keys-of-union.js';
import {type Simplify} from './simplify.js';

type HomomorphicPick<T, Keys extends KeysOfUnion<T>> = {
    [P in keyof T as Extract<P, Keys>]: T[P];
};

type _SetOptional<BaseType, Keys extends keyof BaseType> = BaseType extends unknown
    ? Simplify<Except<BaseType, Keys> & Partial<HomomorphicPick<BaseType, Keys>>>
    : never;

/**
 * Create a type that makes the given keys optional, while keeping the remaining keys as is.
 *
 * Copied from the `SetOptional` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type SetOptional<BaseType, Keys extends keyof BaseType> = (BaseType extends (
    ...arguments_: never
) => any
    ? (...arguments_: Parameters<BaseType>) => ReturnType<BaseType>
    : unknown) &
    _SetOptional<BaseType, Keys>;
