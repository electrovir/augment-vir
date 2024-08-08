import {escapeStringForRegExp} from './regexp-string.js';

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

export function makeCaseInsensitiveRegExp(searchForInput: string | RegExp, caseSensitive: boolean) {
    const regExpFlags: string = `g${
        !caseSensitive && typeof searchForInput === 'string' ? 'i' : ''
    }`;
    const searchFor: RegExp =
        searchForInput instanceof RegExp
            ? new RegExp(
                  searchForInput.source,
                  deDupeRegExFlags(`${searchForInput.flags}${regExpFlags}`),
              )
            : new RegExp(escapeStringForRegExp(searchForInput), regExpFlags);

    return searchFor;
}
