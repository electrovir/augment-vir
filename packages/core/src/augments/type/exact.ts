/* eslint-disable @typescript-eslint/no-unsafe-function-type -- faithfully copied from the `Exact` type in `type-fest`, which uses the `Function` type to pass functions through unchanged */
import {type IsUnknown} from './is-unknown.js';
import {type KeysOfUnion} from './keys-of-union.js';
import {type Primitive} from './primitive-type.js';
import {type IsEqual} from './type-checks.js';

type ToString<T> = T extends string | number ? `${T}` : never;

type ArrayElementOf<T> = T extends readonly (infer ElementType)[] ? ElementType : never;

type ObjectValue<T, K> = K extends keyof T
    ? T[K]
    : ToString<K> extends keyof T
      ? T[ToString<K>]
      : K extends `${infer NumberK extends number}`
        ? NumberK extends keyof T
            ? T[NumberK]
            : never
        : never;

type ExactObject<ParameterType, InputType> = {
    [Key in keyof ParameterType]: Exact<ParameterType[Key], ObjectValue<InputType, Key>>;
} & Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;

/**
 * Create a type that does not allow extra properties, meaning it only allows properties that are
 * explicitly declared.
 *
 * Copied from the `Exact` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Exact<ParameterType, InputType> =
    IsEqual<ParameterType, InputType> extends true
        ? ParameterType
        : ParameterType extends Primitive
          ? ParameterType
          : IsUnknown<ParameterType> extends true
            ? unknown
            : ParameterType extends Function
              ? ParameterType
              : ParameterType extends unknown[]
                ? Array<Exact<ArrayElementOf<ParameterType>, ArrayElementOf<InputType>>>
                : ParameterType extends readonly unknown[]
                  ? ReadonlyArray<Exact<ArrayElementOf<ParameterType>, ArrayElementOf<InputType>>>
                  : ExactObject<ParameterType, InputType>;
