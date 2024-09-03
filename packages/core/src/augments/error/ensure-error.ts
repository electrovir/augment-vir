import {combineErrorMessages, extractErrorMessage} from './error-message.js';

/**
 * Either returns the input if it's already an Error instance or converts it into an Error instance.
 *
 * @category Error : Common
 * @package @augment-vir/common
 */
export function ensureError(maybeError: unknown): Error {
    if (maybeError instanceof Error) {
        return maybeError;
    } else {
        return new Error(extractErrorMessage(maybeError));
    }
}

/**
 * Ensures that the given input is an error and prepends the given message to the ensured Error
 * instance's message.
 *
 * @category Error : Common
 * @package @augment-vir/common
 */
export function ensureErrorAndPrependMessage(maybeError: unknown, prependMessage: string): Error {
    const error = ensureError(maybeError);
    error.message = combineErrorMessages(prependMessage, error.message);
    return error;
}
