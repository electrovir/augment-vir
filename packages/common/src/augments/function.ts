export type AnyFunction<ReturnGeneric = any> = (...args: any[]) => ReturnGeneric;
export type NoInputsFunction<ReturnGeneric = any> = () => ReturnGeneric;

export function isTruthy<T>(input: T): input is NonNullable<T> {
    return !!input;
}
