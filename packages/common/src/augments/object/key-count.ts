import {UnionToIntersection} from '../union';
import {AnyObject} from './any-object';

/**
 * This is not exported because its order is not stable but it's okay for our simple use case where
 * we simply want to count the size of the union.
 */
type UnionToTuple<T> =
    UnionToIntersection<T extends any ? (t: T) => T : never> extends (args: any) => infer W
        ? [...UnionToTuple<Exclude<T, W>>, W]
        : [];

/**
 * Counts the number of unique keys in an object type. Note that a key of just `string` will count
 * as 1.
 */
export type KeyCount<T extends AnyObject> = UnionToTuple<keyof T>['length'];
