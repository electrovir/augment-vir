import {endsWithPunctuationRegExp} from '../string/punctuation.js';

export function extractErrorMessage(maybeError: unknown): string {
    if (!maybeError) {
        return '';
    }

    if (maybeError instanceof Error) {
        return maybeError.message;
    } else if (typeof maybeError === 'object' && 'message' in maybeError) {
        return String(maybeError.message);
    } else {
        return String(maybeError);
    }
}

export function combineErrorMessages(...messages: ReadonlyArray<string | undefined>): string;
export function combineErrorMessages(messages: ReadonlyArray<string | undefined>): string;
export function combineErrorMessages(
    ...rawMessages: [ReadonlyArray<string | undefined>] | ReadonlyArray<string | undefined>
): string {
    const messages: ReadonlyArray<string | undefined> = Array.isArray(rawMessages[0])
        ? rawMessages[0]
        : rawMessages;

    return messages
        .map((message) => {
            return message?.replace(endsWithPunctuationRegExp, '');
        })
        .filter((message) => message)
        .join(': ');
}
