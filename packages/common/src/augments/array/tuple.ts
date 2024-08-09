import {AtLeastTuple} from '@augment-vir/assert';

export type {AtLeastTuple, Tuple} from '@augment-vir/assert';

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
