import {Equal} from '@type-challenges/utils';

export {
    Alike,
    Debug,
    Equal,
    ExpectExtends as DoesExtend,
    ExpectFalse,
    ExpectTrue,
    ExpectValidArgs as HasValidArgs,
    IsAny,
    IsFalse,
    IsTrue,
    MergeInsertions,
    NotAny,
    NotEqual,
    UnionToIntersection,
} from '@type-challenges/utils';

export type CouldBeNullish<VALUE> = Equal<VALUE, NonNullable<VALUE>> extends true ? false : true;
