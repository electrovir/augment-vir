import {isTruthy} from '@augment-vir/test';
import {isLengthAtLeast} from '../array/at-least-length.js';
import {AtLeastTuple} from '../array/tuple.js';
import {extractErrorMessage} from './error-message.js';

export function combineErrors(errors: AtLeastTuple<Error, 1>): Error;
export function combineErrors(errors: ReadonlyArray<Error>): Error | undefined;
export function combineErrors(errors: ReadonlyArray<Error>): Error | undefined {
    if (!isLengthAtLeast(errors, 1)) {
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

    return errors.map(extractErrorMessage).filter(isTruthy).join('\n');
}
