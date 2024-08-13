export type RemoveLastTupleEntry<T extends any[]> = T extends [...infer Head, any?] ? Head : any[];
export type RemoveFirstTupleEntry<T extends any[]> = T extends [any?, ...infer Tail] ? Tail : any[];
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
