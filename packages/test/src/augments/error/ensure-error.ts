import {extractErrorMessage} from './error-message.js';

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
