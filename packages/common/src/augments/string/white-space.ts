import {PartialWithUndefined} from '@augment-vir/core';

/** Collapse all consecutive white space into just one space and trim surrounding whitespace. */
export function collapseWhiteSpace(
    input: string,
    {keepNewLines}: PartialWithUndefined<{keepNewLines: boolean}> = {},
): string {
    if (keepNewLines) {
        return input
            .trim()
            .replaceAll(/[^\S\r\n]+/g, ' ')
            .replaceAll(/[^\S\r\n]?\n+[^\S\r\n]?/g, '\n');
    } else {
        return input.trim().replaceAll(/\s+/g, ' ');
    }
}
