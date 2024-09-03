/**
 * Creates a tuple with length of `OriginalTuple` with values of `NewValueType`.
 *
 * @category Array : Common
 * @package @augment-vir/common
 */
export type MappedTuple<OriginalTuple extends ReadonlyArray<any>, NewValueType> = {
    [I in keyof OriginalTuple]: NewValueType;
};

/**
 * Creates a tuple that is _at least_ of length `Length`.
 *
 * @category Array : Common
 * @package @augment-vir/common
 */
export type AtLeastTuple<Element, Length extends number> = readonly [
    ...Tuple<Element, Length>,
    ...Element[],
];

/**
 * Either a tuple of `T` with length at least 1 or just `T` itself.
 *
 * @category Array : Common
 * @package @augment-vir/common
 */
export type MaybeTuple<T> = T | AtLeastTuple<T, 1>;

/**
 * Remove the last entry in a tuple.
 *
 * @category Array : Common
 * @package @augment-vir/common
 */
export type RemoveLastTupleEntry<T extends any[]> = T extends [...infer Head, any?] ? Head : any[];

/**
 * Remove the first entry in a tuple.
 *
 * @category Array : Common
 * @package @augment-vir/common
 */
export type RemoveFirstTupleEntry<T extends any[]> = T extends [any?, ...infer Tail] ? Tail : any[];

/**
 * A tuple with entries of type `Element` and length of `Length`.
 *
 * @category Array : Common
 * @package @augment-vir/common
 */
export type Tuple<Element, Length extends number> = Length extends Length
    ? number extends Length
        ? Element[]
        : _TupleOf<Element, Length, []>
    : never;

type _TupleOf<
    ArrayElementGeneric,
    LengthGeneric extends number,
    FullArrayGeneric extends unknown[],
> = FullArrayGeneric['length'] extends LengthGeneric
    ? FullArrayGeneric
    : _TupleOf<ArrayElementGeneric, LengthGeneric, [ArrayElementGeneric, ...FullArrayGeneric]>;
