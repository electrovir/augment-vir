export function deDupeRegExFlags(flags: string): string {
    const deDuped = new Set(Array.from(flags.toLowerCase()));

    return Array.from(deDuped).join('');
}

export function addRegExpFlags(originalRegExp: RegExp, flags: string): RegExp {
    return new RegExp(
        originalRegExp.source,
        deDupeRegExFlags(
            [
                originalRegExp.flags,
                flags,
            ].join(''),
        ),
    );
}

export function safeMatch(input: string, regExp: RegExp): string[] {
    const match = input.match(regExp);
    return match ?? [];
}
