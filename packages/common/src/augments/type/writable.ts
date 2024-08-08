import type {Writable} from 'type-fest';

export type {Writable, WritableDeep} from 'type-fest';

export function makeWritable<T>(input: T): Writable<T> {
    return input as Writable<T>;
}
