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

export type MappedTuple<Tuple extends ReadonlyArray<any>, NewValueType> = {
    [I in keyof Tuple]: NewValueType;
};

export type MaybeTuple<T> = T | AtLeastTuple<T, 1>;

export type RemoveFirstTupleEntry<T extends ReadonlyArray<unknown>> = T extends readonly [
    firstArg: unknown,
    ...theRest: infer TheRest,
]
    ? TheRest
    : T;

export type AtLeastTuple<ArrayElementGeneric, LengthGeneric extends number> = readonly [
    ...Tuple<ArrayElementGeneric, LengthGeneric>,
    ...ArrayElementGeneric[],
];
