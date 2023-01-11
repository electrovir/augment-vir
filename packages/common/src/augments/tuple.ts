export type Tuple<
    ArrayElementGeneric,
    LengthGeneric extends number,
> = LengthGeneric extends LengthGeneric
    ? number extends LengthGeneric
        ? ArrayElementGeneric[]
        : _TupleOf<ArrayElementGeneric, LengthGeneric, []>
    : never;
type _TupleOf<
    ArrayElementGeneric,
    LengthGeneric extends number,
    FullArrayGeneric extends unknown[],
> = FullArrayGeneric['length'] extends LengthGeneric
    ? FullArrayGeneric
    : _TupleOf<ArrayElementGeneric, LengthGeneric, [ArrayElementGeneric, ...FullArrayGeneric]>;

export type AtLeastTuple<ArrayElementGeneric, LengthGeneric extends number> = readonly [
    ...Tuple<ArrayElementGeneric, LengthGeneric>,
    ...(ArrayElementGeneric | undefined)[],
];

export function isLengthAtLeast<ArrayElementGeneric, LengthGeneric extends number>(
    array: ReadonlyArray<ArrayElementGeneric | undefined>,
    length: LengthGeneric,
): array is AtLeastTuple<ArrayElementGeneric, LengthGeneric> {
    return array.length >= length;
}
