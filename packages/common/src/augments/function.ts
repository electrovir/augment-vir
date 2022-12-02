export type AnyFunction = (...args: any[]) => any;

export function isTruthy<T>(input: T): input is NonNullable<T> {
    return !!input;
}
