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
