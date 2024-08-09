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
