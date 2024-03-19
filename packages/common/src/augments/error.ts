import {isTruthy} from './boolean';
import {typedHasProperty} from './object/typed-has-property';
import {AtLeastTuple} from './tuple';

export function combineErrors(errors: AtLeastTuple<Error, 1>): Error;
export function combineErrors(errors: ReadonlyArray<never>): undefined;
export function combineErrors(errors: ReadonlyArray<Error>): Error | undefined;
export function combineErrors(errors?: undefined): undefined;
export function combineErrors(
    errors?: AtLeastTuple<Error, 1> | undefined | ReadonlyArray<never> | ReadonlyArray<Error>,
): Error | undefined {
    if (!errors || errors.length === 0) {
        return undefined;
    }
    const firstError = errors[0];

    if (errors.length === 1 && firstError) {
        return firstError;
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

export function extractErrorMessage(maybeError: unknown): string {
    if (!maybeError) {
        return '';
    }

    if (maybeError instanceof Error) {
        return maybeError.message;
    } else if (typedHasProperty(maybeError, 'message')) {
        return String(maybeError.message);
    } else {
        return String(maybeError);
    }
}

export function ensureError(maybeError: unknown): Error {
    if (maybeError instanceof Error) {
        return maybeError;
    } else {
        return new Error(extractErrorMessage(maybeError));
    }
}

export function ensureErrorAndPrependMessage(maybeError: unknown, prependMessage: string): Error {
    const error = ensureError(maybeError);
    error.message = `${prependMessage}: ${error.message}`;
    return error;
}
