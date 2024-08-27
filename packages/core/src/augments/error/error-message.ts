import {stringify} from '../object/stringify.js';
import {removeEndingPunctuation} from '../string/punctuation.js';

export function extractErrorMessage(maybeError: unknown): string {
    if (!maybeError) {
        return '';
    }

    if (maybeError instanceof Error) {
        return maybeError.message;
    } else if (typeof maybeError === 'object' && 'message' in maybeError) {
        return String(maybeError.message);
    } else if (typeof maybeError === 'string') {
        return maybeError;
    } else {
        return stringify(maybeError);
    }
}

export function combineErrorMessages(...messages: ReadonlyArray<string | undefined>): string;
export function combineErrorMessages(messages: ReadonlyArray<string | undefined>): string;
export function combineErrorMessages(
    ...rawMessages: [ReadonlyArray<string | undefined>] | ReadonlyArray<string | undefined>
): string {
    const messages: ReadonlyArray<string> = (
        Array.isArray(rawMessages[0]) ? rawMessages[0] : rawMessages
    ).filter((message) => {
        return message && removeEndingPunctuation(message);
    });

    if (messages.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return messages[0]!;
    } else if (!messages.length) {
        return '';
    }

    const unPunctuatedMessages = messages.map((message, index) => {
        if (index === messages.length - 1) {
            /** Preserve punctuation on the last message. */
            return message;
        } else {
            return removeEndingPunctuation(message);
        }
    });

    return unPunctuatedMessages.join(': ');
}
