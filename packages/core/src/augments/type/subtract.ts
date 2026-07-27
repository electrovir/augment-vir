/* eslint-disable @typescript-eslint/no-unused-vars -- vendored numeric helpers use positional `infer` placeholders in template literal types. */
import {type NegativeInfinity, type PositiveInfinity} from '../number/infinity.js';
import {type If} from './conditional-type.js';
import {type IsAny, type IsEqual, type IsNever} from './type-checks.js';
import {type UnknownArray} from './unknown-array.js';

type Numeric = number | bigint;

type Zero = 0 | 0n;

type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;

type IsNegative<T extends Numeric> = T extends Negative<T> ? true : false;

type ReverseSign<N extends number> = N extends 0
    ? 0
    : N extends PositiveInfinity
      ? NegativeInfinity
      : N extends NegativeInfinity
        ? PositiveInfinity
        : `${N}` extends `-${infer P extends number}`
          ? P
          : `-${N}` extends `${infer R extends number}`
            ? R
            : never;

type StringToNumber<S extends string> = S extends `${infer N extends number}`
    ? N
    : S extends 'Infinity'
      ? PositiveInfinity
      : S extends '-Infinity'
        ? NegativeInfinity
        : never;

type Absolute<N extends number | bigint> = N extends bigint
    ? `${N}` extends `-${infer Magnitude extends bigint}`
        ? Magnitude
        : N
    : `${N}` extends `-${infer Magnitude}`
      ? StringToNumber<Magnitude>
      : N;

type IfNotAnyOrNever<T, IfNotAny, IfAny = any, IfNever = never> = If<
    IsAny<T>,
    IfAny,
    If<IsNever<T>, IfNever, IfNotAny>
>;

type DigitCharacter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type DigitTupleOf<Digit extends DigitCharacter, Fill> = [
    [],
    [Fill],
    [
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
    ],
    [
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
        Fill,
    ],
][Digit];

type RepeatTupleTenTimes<Tuple extends UnknownArray> = [
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
    ...Tuple,
];

type BuildTupleDigitByDigit<
    Length extends string,
    Fill,
    Accumulator extends UnknownArray = [],
> = Length extends `${infer First extends DigitCharacter}${infer Rest}`
    ? BuildTupleDigitByDigit<
          Rest,
          Fill,
          [
              ...RepeatTupleTenTimes<Accumulator>,
              ...DigitTupleOf<First, Fill>,
          ]
      >
    : Accumulator;

type BuildTuple<Length extends number, Fill> = number extends Length
    ? Fill[]
    : BuildTupleDigitByDigit<`${Length}`, Fill>;

type TupleOf<Length extends number, Fill = unknown> = IfNotAnyOrNever<
    Length,
    BuildTuple<If<IsNegative<Length>, 0, Length>, Fill>,
    Fill[],
    []
>;

type And<A extends boolean, B extends boolean> = A extends true
    ? B extends true
        ? true
        : false
    : false;

type Or<A extends boolean, B extends boolean> = A extends true
    ? true
    : B extends true
      ? true
      : false;

type StringToArray<S extends string, Result extends string[] = []> = string extends S
    ? never
    : S extends `${infer F}${infer R}`
      ? StringToArray<
            R,
            [
                ...Result,
                F,
            ]
        >
      : Result;

type StringLength<S extends string> = string extends S ? never : StringToArray<S>['length'];

type NumericString = '0123456789';

type PositiveNumericCharacterGt<
    A extends string,
    B extends string,
> = NumericString extends `${infer HeadA}${A}${infer TailA}`
    ? NumericString extends `${infer HeadB}${B}${infer TailB}`
        ? HeadA extends `${HeadB}${infer _}${infer __}`
            ? true
            : false
        : never
    : never;

type SameLengthPositiveNumericStringGt<
    A extends string,
    B extends string,
> = A extends `${infer FirstA}${infer RestA}`
    ? B extends `${infer FirstB}${infer RestB}`
        ? FirstA extends FirstB
            ? SameLengthPositiveNumericStringGt<RestA, RestB>
            : PositiveNumericCharacterGt<FirstA, FirstB>
        : never
    : false;

type PositiveNumericStringGt<A extends string, B extends string> = A extends B
    ? false
    : [
            TupleOf<StringLength<A>, 0>,
            TupleOf<StringLength<B>, 0>,
        ] extends infer R extends [
            readonly unknown[],
            readonly unknown[],
        ]
      ? R[0] extends [
            ...R[1],
            ...infer Remain extends readonly unknown[],
        ]
          ? 0 extends Remain['length']
              ? SameLengthPositiveNumericStringGt<A, B>
              : true
          : false
      : never;

type GreaterThan<A extends number, B extends number> = A extends number
    ? B extends number
        ? number extends A | B
            ? boolean
            : [
                    IsEqual<A, PositiveInfinity>,
                    IsEqual<A, NegativeInfinity>,
                    IsEqual<B, PositiveInfinity>,
                    IsEqual<B, NegativeInfinity>,
                ] extends infer R extends [
                    boolean,
                    boolean,
                    boolean,
                    boolean,
                ]
              ? Or<
                    And<IsEqual<R[0], true>, IsEqual<R[2], false>>,
                    And<IsEqual<R[3], true>, IsEqual<R[1], false>>
                > extends true
                  ? true
                  : Or<
                          And<IsEqual<R[1], true>, IsEqual<R[3], false>>,
                          And<IsEqual<R[2], true>, IsEqual<R[0], false>>
                      > extends true
                    ? false
                    : true extends R[number]
                      ? false
                      : [
                              IsNegative<A>,
                              IsNegative<B>,
                          ] extends infer R extends [
                              boolean,
                              boolean,
                          ]
                        ? [
                              true,
                              false,
                          ] extends R
                            ? false
                            : [
                                    false,
                                    true,
                                ] extends R
                              ? true
                              : [
                                      false,
                                      false,
                                  ] extends R
                                ? PositiveNumericStringGt<`${A}`, `${B}`>
                                : PositiveNumericStringGt<`${Absolute<B>}`, `${Absolute<A>}`>
                        : never
              : never
        : never
    : never;

type GreaterThanOrEqual<A extends number, B extends number> = number extends A | B
    ? boolean
    : A extends number
      ? B extends number
          ? A extends B
              ? true
              : GreaterThan<A, B>
          : never
      : never;

type LessThan<A extends number, B extends number> =
    GreaterThanOrEqual<A, B> extends infer Result ? (Result extends true ? false : true) : never;

type SubtractIfAGreaterThanB<A extends number, B extends number> =
    TupleOf<A> extends [
        ...TupleOf<B>,
        ...infer R,
    ]
        ? R['length']
        : never;

type SubtractPositives<A extends number, B extends number> =
    LessThan<A, B> extends true
        ? ReverseSign<SubtractIfAGreaterThanB<B, A>>
        : SubtractIfAGreaterThanB<A, B>;

type SubtractPostChecks<
    A extends number,
    B extends number,
    AreNegative = [
        IsNegative<A>,
        IsNegative<B>,
    ],
> = AreNegative extends [
    false,
    false,
]
    ? SubtractPositives<A, B>
    : AreNegative extends [
            true,
            true,
        ]
      ? ReverseSign<SubtractPositives<Absolute<A>, Absolute<B>>>
      : [
              ...TupleOf<Absolute<A>>,
              ...TupleOf<Absolute<B>>,
          ] extends infer R extends unknown[]
        ? LessThan<A, B> extends true
            ? ReverseSign<R['length']>
            : R['length']
        : never;

/**
 * Returns the difference between two numbers. `A` or `B` can only support `-999` ~ `999`.
 *
 * Copied from the `Subtract` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Subtract<A extends number, B extends number> = number extends A | B
    ? number
    : A extends B & (PositiveInfinity | NegativeInfinity)
      ? number
      : A extends NegativeInfinity
        ? NegativeInfinity
        : B extends PositiveInfinity
          ? NegativeInfinity
          : A extends PositiveInfinity
            ? PositiveInfinity
            : B extends NegativeInfinity
              ? PositiveInfinity
              : A extends B
                ? 0
                : A extends 0
                  ? ReverseSign<B>
                  : B extends 0
                    ? A
                    : SubtractPostChecks<A, B>;
