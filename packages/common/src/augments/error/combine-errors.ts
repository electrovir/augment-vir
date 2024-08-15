import {check} from '@augment-vir/assert';
import {extractErrorMessage} from '@augment-vir/core';
import {AtLeastTuple} from '../array/tuple.js';

export function combineErrors(errors: AtLeastTuple<Error, 1>): Error;
export function combineErrors(errors: ReadonlyArray<Error>): Error | undefined;
export function combineErrors(errors: ReadonlyArray<Error>): Error | undefined {
    if (!check.isLengthAtLeast(errors, 1)) {
        return undefined;
    }

    if (errors.length === 1) {
        return errors[0];
    }

    return new Error(errors.map((error) => extractErrorMessage(error).trim()).join('\n'));
}

export function combineErrorMessages(
    errors?: ReadonlyArray<Error | string | undefined> | undefined,
): string {
    if (!errors) {
        return '';
    }

    return errors.map(extractErrorMessage).filter(check.isTruthy).join('\n');
}
