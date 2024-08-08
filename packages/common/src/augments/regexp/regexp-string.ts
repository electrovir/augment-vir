/**
 * Escapes characters from the given string so that it can be used within a RegExp without being
 * parsed as RegExp syntax.
 */
export function escapeStringForRegExp(input: string): string {
    return input.replace(/[\^$\\.*+?()[\]{}|]/g, String.raw`\$&`);
}
