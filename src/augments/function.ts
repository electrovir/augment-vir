export function isTruthy<T>(input: T): input is NonNullable<T> {
    return !!input;
}
