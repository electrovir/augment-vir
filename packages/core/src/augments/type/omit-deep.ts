/* eslint-disable @typescript-eslint/no-unsafe-function-type, no-loss-of-precision, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type -- faithful copy of type-fest's OmitDeep, Paths, and their vendored numeric helpers, which use the global `Function` type, literal infinity types, positional `infer` placeholders, and the `{}` default for options objects. */
import {type ApplyDefaultOptions} from './apply-default-options.js';
import {type BuiltIns} from './built-in-type.js';
import {type If} from './conditional-type.js';
import {type LiteralUnion} from './literal-union.js';
import {type IsAny, type IsEqual, type IsNever} from './type-checks.js';
import {type UnknownArray} from './unknown-array.js';

type IfNotAnyOrNever<T, IfNotAny, IfAny = any, IfNever = never> = If<
    IsAny<T>,
    IfAny,
    If<IsNever<T>, IfNever, IfNotAny>
>;

type NonRecursiveType =
    | BuiltIns
    | Function
    | (new (...arguments_: any[]) => unknown)
    | Promise<unknown>;

type MapsSetsOrArrays =
    | ReadonlyMap<unknown, unknown>
    | WeakMap<WeakKey, unknown>
    | ReadonlySet<unknown>
    | WeakSet<WeakKey>
    | UnknownArray;

type DigitCharacter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type PositiveInfinity = 1e999;
type NegativeInfinity = -1e999;

type Zero = 0 | 0n;

type Negative<T extends number | bigint> = T extends Zero
    ? never
    : `${T}` extends `-${string}`
      ? T
      : never;

type IsNegative<T extends number | bigint> = T extends Negative<T> ? true : false;

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

type StringToArray<S extends string, Result extends string[] = []> = string extends S
    ? never
    : S extends `${infer First}${infer Rest}`
      ? StringToArray<
            Rest,
            [
                ...Result,
                First,
            ]
        >
      : Result;

type StringLength<S extends string> = string extends S ? never : StringToArray<S>['length'];

type NumericString = '0123456789';

type PositiveNumericCharacterGt<
    A extends string,
    B extends string,
> = NumericString extends `${infer HeadA}${A}${infer _TailA}`
    ? NumericString extends `${infer HeadB}${B}${infer _TailB}`
        ? HeadA extends `${HeadB}${infer _Middle}${infer _Rest}`
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
        ] extends infer Lengths extends [
            readonly unknown[],
            readonly unknown[],
        ]
      ? Lengths[0] extends [
            ...Lengths[1],
            ...infer Remaining extends readonly unknown[],
        ]
          ? 0 extends Remaining['length']
              ? SameLengthPositiveNumericStringGt<A, B>
              : true
          : false
      : never;

/**
 * Simplified 2-input logical `and`. `type-fest` routes `And` through `AndAll`/`AllExtend`, but
 * every consumer here (`GreaterThan` and `InternalPaths`) always passes concrete `true`/`false`
 * values, for which this definition is behaviorally identical.
 */
type And<A extends boolean, B extends boolean> = A extends true
    ? B extends true
        ? true
        : false
    : false;

/** Simplified 2-input logical `or`. See the note on {@link And}. */
type Or<A extends boolean, B extends boolean> = A extends true
    ? true
    : B extends true
      ? true
      : false;

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
                          ] extends infer Signs extends [
                              boolean,
                              boolean,
                          ]
                        ? [
                              true,
                              false,
                          ] extends Signs
                            ? false
                            : [
                                    false,
                                    true,
                                ] extends Signs
                              ? true
                              : [
                                      false,
                                      false,
                                  ] extends Signs
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

type _TupleOf<Length extends number, Fill> = number extends Length
    ? Fill[]
    : BuildTupleDigitByDigit<`${Length}`, Fill>;

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

type TupleOf<Length extends number, Fill = unknown> = IfNotAnyOrNever<
    Length,
    _TupleOf<If<IsNegative<Length>, 0, Length>, Fill>,
    Fill[],
    []
>;

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

type Subtract<A extends number, B extends number> = number extends A | B
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

type TupleMax<
    A extends number[],
    Result extends number = NegativeInfinity,
> = number extends A[number]
    ? never
    : A extends [
            infer First extends number,
            ...infer Rest extends number[],
        ]
      ? GreaterThan<First, Result> extends true
          ? TupleMax<Rest, First>
          : TupleMax<Rest, Result>
      : Result;

type SumPositives<A extends number, B extends number> = [
    ...TupleOf<A>,
    ...TupleOf<B>,
]['length'] extends infer Result extends number
    ? Result
    : never;

type SumPostChecks<
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
    ? SumPositives<A, B>
    : AreNegative extends [
            true,
            true,
        ]
      ? ReverseSign<SumPositives<Absolute<A>, Absolute<B>>>
      : Absolute<Subtract<Absolute<A>, Absolute<B>>> extends infer Result extends number
        ? TupleMax<
              [
                  Absolute<A>,
                  Absolute<B>,
              ]
          > extends infer LargestMagnitude extends number
            ? LargestMagnitude extends A | B
                ? Result
                : ReverseSign<Result>
            : never
        : never;

type Sum<A extends number, B extends number> = number extends A | B
    ? number
    : A extends B & (PositiveInfinity | NegativeInfinity)
      ? A
      : A | B extends PositiveInfinity | NegativeInfinity
        ? number
        : A extends PositiveInfinity | NegativeInfinity
          ? A
          : B extends PositiveInfinity | NegativeInfinity
            ? B
            : A extends 0
              ? B
              : B extends 0
                ? A
                : A extends ReverseSign<B>
                  ? 0
                  : SumPostChecks<A, B>;

type IsNumberLike<N> = IfNotAnyOrNever<
    N,
    N extends number | `${number}` ? true : false,
    boolean,
    false
>;

type StaticPartOfArray<T extends UnknownArray, Result extends UnknownArray = []> = T extends unknown
    ? number extends T['length']
        ? T extends readonly [
              infer U,
              ...infer V,
          ]
            ? StaticPartOfArray<
                  V,
                  [
                      ...Result,
                      U,
                  ]
              >
            : Result
        : T
    : never;

type VariablePartOfArray<T extends UnknownArray> = T extends unknown
    ? T extends readonly [
          ...StaticPartOfArray<T>,
          ...infer U,
      ]
        ? U
        : []
    : never;

type SetArrayAccess<T extends UnknownArray, IsReadonly extends boolean> = T extends readonly [
    ...infer U,
]
    ? IsReadonly extends true
        ? readonly [...U]
        : [...U]
    : T;

type IsArrayReadonly<T extends UnknownArray> = If<
    IsNever<T>,
    false,
    T extends unknown[] ? false : true
>;

type SplitFixedArrayByIndex<
    T extends UnknownArray,
    SplitIndex extends number,
> = SplitIndex extends 0
    ? [
          [],
          T,
      ]
    : T extends readonly [
            ...TupleOf<SplitIndex>,
            ...infer V,
        ]
      ? T extends readonly [
            ...infer U,
            ...V,
        ]
          ? [
                U,
                V,
            ]
          : [
                never,
                never,
            ]
      : [
            never,
            never,
        ];

type SplitVariableArrayByIndex<
    T extends UnknownArray,
    SplitIndex extends number,
    T1 = Subtract<SplitIndex, StaticPartOfArray<T>['length']>,
    T2 = T1 extends number
        ? TupleOf<
              GreaterThanOrEqual<T1, 0> extends true ? T1 : number,
              VariablePartOfArray<T>[number]
          >
        : [],
> = SplitIndex extends 0
    ? [
          [],
          T,
      ]
    : GreaterThanOrEqual<StaticPartOfArray<T>['length'], SplitIndex> extends true
      ? [
            SplitFixedArrayByIndex<StaticPartOfArray<T>, SplitIndex>[0],
            [
                ...SplitFixedArrayByIndex<StaticPartOfArray<T>, SplitIndex>[1],
                ...VariablePartOfArray<T>,
            ],
        ]
      : [
            [
                ...StaticPartOfArray<T>,
                ...(T2 extends UnknownArray ? T2 : []),
            ],
            VariablePartOfArray<T>,
        ];

type SplitArrayByIndex<T extends UnknownArray, SplitIndex extends number> = SplitIndex extends 0
    ? [
          [],
          T,
      ]
    : number extends T['length']
      ? SplitVariableArrayByIndex<T, SplitIndex>
      : SplitFixedArrayByIndex<T, SplitIndex>;

type ArraySplice<
    T extends UnknownArray,
    Start extends number,
    DeleteCount extends number,
    Items extends UnknownArray = [],
> =
    SplitArrayByIndex<T, Start> extends [
        infer U extends UnknownArray,
        infer V extends UnknownArray,
    ]
        ? SplitArrayByIndex<V, DeleteCount> extends [
              infer _Deleted extends UnknownArray,
              infer X extends UnknownArray,
          ]
            ? [
                  ...U,
                  ...Items,
                  ...X,
              ]
            : never
        : never;

type ToString<T> = T extends string | number ? `${T}` : never;

type ExactKey<T extends object, Key extends PropertyKey> = Key extends keyof T
    ? Key
    : ToString<Key> extends keyof T
      ? ToString<Key>
      : Key extends `${infer NumberKey extends number}`
        ? NumberKey extends keyof T
            ? NumberKey
            : never
        : never;

type UnionToIntersection<Union> = (
    Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
    ? Intersection & Union
    : never;

type UnionMember<T> =
    IsNever<T> extends true
        ? never
        : UnionToIntersection<T extends any ? () => T : never> extends () => infer R
          ? R
          : never;

type _ExcludeExactly<Union, Delete> = IfNotAnyOrNever<
    Delete,
    Union extends unknown
        ? [
              Delete extends unknown ? If<IsEqual<Union, Delete>, true, never> : never,
          ] extends [never]
            ? Union
            : never
        : never,
    Union,
    Union
>;

type ExcludeExactly<Union, Delete> = IfNotAnyOrNever<
    Union,
    _ExcludeExactly<Union, Delete>,
    If<IsAny<Delete>, never, Union>,
    If<IsNever<Delete>, never, Union>
>;

type _UnionToTuple<Union, Accumulator extends UnknownArray = [], Member = UnionMember<Union>> =
    IsNever<Union> extends true
        ? Accumulator
        : _UnionToTuple<
              ExcludeExactly<Union, Member>,
              [
                  Member,
                  ...Accumulator,
              ]
          >;

type UnionToTuple<Union> =
    _UnionToTuple<Union> extends infer Result extends UnknownArray ? Result : never;

type ConditionalSimplifyDeep<
    Type,
    ExcludeType = never,
    IncludeType = unknown,
> = Type extends ExcludeType
    ? Type
    : Type extends IncludeType
      ? {[TypeKey in keyof Type]: ConditionalSimplifyDeep<Type[TypeKey], ExcludeType, IncludeType>}
      : Type;

type SimplifyDeep<Type, ExcludeType = never> = ConditionalSimplifyDeep<
    Type,
    ExcludeType | NonRecursiveType | Exclude<MapsSetsOrArrays, UnknownArray>,
    object
>;

/**
 * Options for {@link Paths}.
 *
 * Copied from the `PathsOptions` type in `type-fest` v5.6 so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PathsOptions = {
    /**
     * The maximum depth to recurse when searching for paths. Range: 0 ~ 10.
     *
     * @default 5
     */
    maxRecursionDepth?: number;
    /**
     * Use bracket notation for array indices and numeric object keys.
     *
     * @default false
     */
    bracketNotation?: boolean;
    /**
     * Only include leaf paths in the output.
     *
     * @default false
     */
    leavesOnly?: boolean;
    /**
     * Only include paths at the specified depth. By default all paths up to
     * {@link PathsOptions.maxRecursionDepth} are included. Depth starts at `0` for root properties.
     *
     * @default number
     */
    depth?: number;
};

type DefaultPathsOptions = {
    maxRecursionDepth: 5;
    bracketNotation: false;
    leavesOnly: false;
    depth: number;
};

type InternalPaths<T, Options extends Required<PathsOptions>, CurrentDepth extends number> = {
    [Key in keyof T]: Key extends string | number
        ? (
              And<Options['bracketNotation'], IsNumberLike<Key>> extends true
                  ? `[${Key}]`
                  : CurrentDepth extends 0
                    ? /**
                       * Return both `Key` and `ToString<Key>` because for number keys, like `1`, both `1` and `'1'` are
                       * valid keys.
                       */
                      Key | ToString<Key>
                    : `.${Key | ToString<Key>}`
          ) extends infer TransformedKey extends string | number
            ?
                  | ((
                        Options['leavesOnly'] extends true
                            ? Options['maxRecursionDepth'] extends CurrentDepth
                                ? TransformedKey
                                : IsNever<T[Key]> extends true
                                  ? TransformedKey
                                  : T[Key] extends infer Value
                                    ? Value extends
                                          | readonly []
                                          | NonRecursiveType
                                          | Exclude<MapsSetsOrArrays, UnknownArray>
                                        ? TransformedKey
                                        : /** Check for empty object and `unknown`, because `keyof unknown` is `never`. */
                                          IsNever<keyof Value> extends true
                                          ? TransformedKey
                                          : never
                                    : never
                            : TransformedKey
                    ) extends infer LeafFilteredKey
                        ? /**
                           * If `depth` is provided, the condition becomes truthy only when it matches `CurrentDepth`.
                           * Otherwise, since `depth` defaults to `number`, the condition is always truthy, returning paths
                           * at all depths.
                           */
                          CurrentDepth extends Options['depth']
                            ? LeafFilteredKey
                            : never
                        : never)
                  /** Recursively generate paths for the current key. */
                  | (GreaterThan<Options['maxRecursionDepth'], CurrentDepth> extends true
                        ? `${TransformedKey}${PathsHelper<T[Key], Options, Sum<CurrentDepth, 1>> &
                              (string | number)}`
                        : never)
            : never
        : never;
}[keyof T & (T extends UnknownArray ? number : unknown)];

type PathsHelper<
    T,
    Options extends Required<PathsOptions>,
    CurrentDepth extends number = 0,
> = T extends NonRecursiveType | Exclude<MapsSetsOrArrays, UnknownArray>
    ? never
    : IsAny<T> extends true
      ? never
      : T extends object
        ? InternalPaths<Required<T>, Options, CurrentDepth>
        : never;

/**
 * Generate a union of all possible paths to properties in the given object. Also works with arrays.
 *
 * Copied from the `Paths` type in `type-fest` v5.6 so that this package's public types do not
 * depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Paths<T, Options extends PathsOptions = {}> = PathsHelper<
    T,
    ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>
>;

type OmitDeepArrayWithOnePath<
    ArrayType extends UnknownArray,
    P extends string | number,
> = P extends `${infer ArrayIndex extends number}.${infer SubPath}`
    ? number extends ArrayIndex
        ? Array<OmitDeepWithOnePath<NonNullable<ArrayType[number]>, SubPath>>
        : ArraySplice<
              ArrayType,
              ArrayIndex,
              1,
              [OmitDeepWithOnePath<NonNullable<ArrayType[ArrayIndex]>, SubPath>]
          >
    : P extends `${infer ArrayIndex extends number}`
      ? number extends ArrayIndex
          ? []
          : ArraySplice<ArrayType, ArrayIndex, 1, [unknown]>
      : ArrayType;

type OmitDeepObjectWithOnePath<
    ObjectT extends object,
    P extends string | number,
> = P extends `${infer RecordKeyInPath}.${infer SubPath}`
    ? {
          [Key in keyof ObjectT]: IsEqual<RecordKeyInPath, ToString<Key>> extends true
              ? ExactKey<ObjectT, Key> extends infer RealKey
                  ? RealKey extends keyof ObjectT
                      ? OmitDeepWithOnePath<ObjectT[RealKey], SubPath>
                      : ObjectT[Key]
                  : ObjectT[Key]
              : ObjectT[Key];
      }
    : ExactKey<ObjectT, P> extends infer Key
      ? IsNever<Key> extends true
          ? ObjectT
          : Key extends PropertyKey
            ? Omit<ObjectT, Key>
            : ObjectT
      : ObjectT;

type OmitDeepWithOnePath<T, Path extends string | number> = T extends NonRecursiveType
    ? T
    : T extends UnknownArray
      ? SetArrayAccess<OmitDeepArrayWithOnePath<T, Path>, IsArrayReadonly<T>>
      : T extends object
        ? OmitDeepObjectWithOnePath<T, Path>
        : T;

type OmitDeepHelper<T, PathTuple extends UnknownArray> = PathTuple extends [
    infer Path,
    ...infer RestPaths,
]
    ? OmitDeepHelper<OmitDeepWithOnePath<T, Path & (string | number)>, RestPaths>
    : T;

/**
 * Omit properties from a deeply-nested object, supporting recursion into arrays (each removed array
 * item is replaced with `unknown` at its index).
 *
 * Copied from the `OmitDeep` type in `type-fest` v5.6 so that this package's public types do not
 * depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type OmitDeep<T, PathUnion extends LiteralUnion<Paths<T>, string>> = SimplifyDeep<
    OmitDeepHelper<T, UnionToTuple<PathUnion>>,
    UnknownArray
>;
