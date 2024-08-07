import {hasProperty} from 'run-time-assertions';

export function extractErrorMessage(maybeError: unknown): string {
    if (!maybeError) {
        return '';
    }

    if (maybeError instanceof Error) {
        return maybeError.message;
    } else if (hasProperty(maybeError, 'message')) {
        return String(maybeError.message);
    } else {
        return String(maybeError);
    }
}
