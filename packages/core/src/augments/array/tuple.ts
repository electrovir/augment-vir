import {type Digit} from '../number/digit.js';

/**
 * Creates a tuple with length of `OriginalTuple` with values of `NewValueType`.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type MappedTuple<OriginalTuple extends ReadonlyArray<any>, NewValueType> = {
    [I in keyof OriginalTuple]: NewValueType;
};

/**
 * Creates a tuple that is _at least_ of length `Length`.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type AtLeastTuple<Element, Length extends number> = readonly [
    ...Tuple<Element, Length>,
    ...Element[],
];

/**
 * Either a tuple of `T` with length at least 1 or just `T` itself.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type MaybeTuple<T> = T | AtLeastTuple<T, 1>;

/**
 * Remove the last entry in a tuple.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RemoveLastTupleEntry<T extends any[]> = T extends [
    ...infer Head,
    any?,
]
    ? Head
    : any[];

/**
 * Remove the first entry in a tuple.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RemoveFirstTupleEntry<T extends any[]> = T extends [
    any?,
    ...infer Tail,
]
    ? Tail
    : any[];

/**
 * Detects whether `Length` is a safe size to materialize as a tuple at the type level. Only matches
 * non-negative integer literals 0–99, whose stringification is exactly one or two ASCII digits.
 * Anything else — sizes ≥ 100, negatives, non-integers, scientific notation, or a non-literal
 * `number` — fails to match, because `_TupleOf` either exceeds TS's recursion limit or never
 * terminates for those inputs.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type IsTupleSizeSafe<Length extends number> = `${Length}` extends
    | `${Digit}`
    | `${Digit}${Digit}`
    ? true
    : false;

/**
 * A tuple with entries of type `Element` and length of `Length`.
 *
 * Only literal `Length` values from 0 to 99 produce a precise tuple; anything else (≥ 100,
 * negatives, non-integers, scientific notation, or a non-literal `number`) falls back to
 * `Element[]`, because the recursive helper either exceeds TS's recursion limit or never terminates
 * for those inputs.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Tuple<Element, Length extends number> = Length extends Length
    ? IsTupleSizeSafe<Length> extends true
        ? _TupleOf<Element, Length, []>
        : Element[]
    : never;

type _TupleOf<
    ArrayElementGeneric,
    LengthGeneric extends number,
    FullArrayGeneric extends unknown[],
> = FullArrayGeneric['length'] extends LengthGeneric
    ? FullArrayGeneric
    : _TupleOf<
          ArrayElementGeneric,
          LengthGeneric,
          [
              ArrayElementGeneric,
              ...FullArrayGeneric,
          ]
      >;

/**
 * Helper type for {@link TupleIndexes}.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type TupleIndexesRecursive<
    T extends readonly unknown[],
    Accumulated extends number[] = [],
> = T extends readonly [
    any,
    ...infer Rest,
]
    ?
          | Accumulated['length']
          | TupleIndexesRecursive<
                Rest,
                [
                    ...Accumulated,
                    1,
                ]
            >
    : never;

/**
 * Extracts all the indexes of a tuple.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type TupleIndexes<T extends readonly unknown[]> = number extends T['length']
    ? number
    : TupleIndexesRecursive<T>;
