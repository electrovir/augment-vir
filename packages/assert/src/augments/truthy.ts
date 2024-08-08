import {Falsy, FalsyTypes} from './falsy.js';

export type Truthy<T> = Exclude<T, FalsyTypes>;

export function isTruthy<T>(input: T): input is Truthy<T> {
    return !!input;
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
