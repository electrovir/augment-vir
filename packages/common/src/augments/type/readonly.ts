export type {ReadonlyDeep} from 'type-fest';

export function makeReadonly<T>(input: T): Readonly<T> {
    return input;
}
