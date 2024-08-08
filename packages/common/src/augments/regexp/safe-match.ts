export function safeMatch(input: string, regExp: RegExp): string[] {
    const match = input.match(regExp);
    return match ?? [];
}
