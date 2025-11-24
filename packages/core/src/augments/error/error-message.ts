import {stringify} from '../object/stringify.js';
import {removeEndingPunctuation} from '../string/punctuation.js';

/**
 * Tries its hardest to extract an error message from the input, which may be anything (not even an
 * Error instance).
 *
 * @category Error
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function extractErrorMessage(maybeError: unknown): string {
    if (!maybeError) {
        return '';
    }

    if (typeof maybeError === 'string') {
        return maybeError;
    } else if (maybeError instanceof Error) {
        return maybeError.message;
    } else if (typeof maybeError === 'object' && 'message' in maybeError) {
        return String(maybeError.message);
    } else {
        return stringify(maybeError);
    }
}

/**
 * Combines multiple error messages into a single error message.
 *
 * @category Error
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function combineErrorMessages(...rawMessages: ReadonlyArray<unknown>): string {
    const messages: ReadonlyArray<string> = rawMessages
        .map((message) => extractErrorMessage(message))
        .filter((message) => {
            return !!message;
        })
        .map((message, index, originalArray) => {
            const shouldRemovePunctuation =
                originalArray.length > 1 && index < originalArray.length - 1;

            if (shouldRemovePunctuation) {
                return removeEndingPunctuation(message);
            } else {
                return message;
            }
        });

    if (messages.length < 2) {
        return messages[0] || 'Error';
    }

    return messages.join(': ');
}
