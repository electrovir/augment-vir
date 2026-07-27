/* eslint-disable @typescript-eslint/no-wrapper-object-types, sonarjs/no-primitive-wrappers -- faithful copy of type-fest's Jsonify, which intentionally matches boxed primitive wrapper objects to convert them to primitives. */
// cspell:words Jsonable
import {type NegativeInfinity, type PositiveInfinity} from '../number/infinity.js';
import {type EmptyObject} from '../type/empty-object.js';
import {type IsUnknown} from '../type/is-unknown.js';
import {type IsAny, type IsNever} from '../type/type-checks.js';
import {type TypedArray} from '../type/typed-array.js';
import {type UndefinedToOptional} from '../type/undefined-to-optional.js';
import {type UnknownArray} from '../type/unknown-array.js';
import {type JsonPrimitive, type JsonValue} from './json-value.js';

type NotJsonable = ((...arguments_: any[]) => any) | undefined | symbol;

type NeverToNull<T> = IsNever<T> extends true ? null : T;

type UndefinedToNull<T> = T extends undefined ? null : T;

type JsonifyList<T extends UnknownArray> = T extends readonly []
    ? []
    : T extends readonly [
            infer F,
            ...infer R,
        ]
      ? [
            F,
            ...R,
        ] extends T
          ? [
                NeverToNull<Jsonify<F>>,
                ...JsonifyList<R>,
            ]
          : [NeverToNull<Jsonify<F>>]
      : IsUnknown<T[number]> extends true
        ? JsonValue[]
        : Array<T[number] extends NotJsonable ? null : Jsonify<UndefinedToNull<T[number]>>>;

type FilterJsonableKeys<T extends object> = {
    [Key in keyof T]: T[Key] extends NotJsonable ? never : Key;
}[keyof T];

type JsonifyObject<T extends object> = {
    [Key in keyof Pick<T, FilterJsonableKeys<T>>]: Jsonify<T[Key]>;
};

/**
 * Transform a type to one that is assignable to the `JsonValue` type.
 *
 * Copied from the `Jsonify` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category JSON
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Jsonify<T> =
    IsAny<T> extends true
        ? any
        : T extends PositiveInfinity | NegativeInfinity
          ? null
          : T extends JsonPrimitive
            ? T
            : T extends {toJSON(): infer J}
              ? (() => J) extends () => JsonValue
                  ? J
                  : Jsonify<J>
              : T extends Number
                ? number
                : T extends String
                  ? string
                  : T extends Boolean
                    ? boolean
                    : T extends Map<any, any> | Set<any>
                      ? EmptyObject
                      : T extends TypedArray
                        ? Record<string, number>
                        : T extends NotJsonable
                          ? never
                          : T extends UnknownArray
                            ? JsonifyList<T>
                            : T extends object
                              ? JsonifyObject<UndefinedToOptional<T>>
                              : IsUnknown<T> extends true
                                ? JsonValue
                                : never;
