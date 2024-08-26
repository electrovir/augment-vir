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
    const messages: ReadonlyArray<string | undefined> = (
        Array.isArray(rawMessages[0]) ? rawMessages[0] : rawMessages
    ).filter((message) => message);

    if (messages.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return messages[0]!;
    }

    const unPunctuatedMessages = messages
        .map((message, index) => {
            if (index === messages.length - 1) {
                /** Preserve punctuation on the last message. */
                return message;
            } else {
                return message?.replace(endsWithPunctuationRegExp, '');
            }
        })
        .filter((message) => message);

    if (unPunctuatedMessages.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return unPunctuatedMessages[0]!;
    }

    return unPunctuatedMessages.join(': ');
}
