export type FalsyTypes = undefined | null | false | 0 | '' | -0 | 0n;
export type Truthy<T> = Exclude<T, FalsyTypes>;
export type Falsy<T> = Extract<T, FalsyTypes>;

export function isTruthy<T>(input: T): input is Truthy<T> {
    return !!input;
}

export function isFalsy<T>(input: T): input is Falsy<T> {
    return !input;
}

export function ifTruthy<const InputType, IfTruthyType, IfFalsyType>(
    checkThis: InputType,
    ifTruthyCallback: (truthyInput: Truthy<InputType>) => IfTruthyType,
    ifFalsyCallback: (truthyInput: Falsy<InputType>) => IfFalsyType,
): IfTruthyType | IfFalsyType {
    if (isTruthy(checkThis)) {
        return ifTruthyCallback(checkThis);
    } else {
        return ifFalsyCallback(checkThis as Falsy<InputType>);
    }
}
