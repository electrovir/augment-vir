export function replaceStringAtIndex(
    originalString: string,
    start: number,
    newString: string,
    length = newString.length,
): string {
    const before = originalString.slice(0, Math.max(0, start));
    const after = originalString.slice(Math.max(0, start + length));

    return `${before}${newString}${after}`;
}
