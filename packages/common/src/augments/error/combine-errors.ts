import {check} from '@augment-vir/assert';
import {extractErrorMessage, type AtLeastTuple} from '@augment-vir/core';

export function combineErrors(errors: AtLeastTuple<Error, 1>): Error;
export function combineErrors(errors: ReadonlyArray<Error | undefined>): Error | undefined;
export function combineErrors(rawErrors: ReadonlyArray<Error | undefined>): Error | undefined {
    const errors = rawErrors.filter((error) => error);

    if (!check.isLengthAtLeast(errors, 1)) {
        return undefined;
    }

    if (errors.length === 1) {
        return errors[0];
    }

    return new Error(errors.map((error) => extractErrorMessage(error).trim()).join('\n'));
}
