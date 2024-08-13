import {PartialWithUndefined} from '@augment-vir/core';

/** Collapse all consecutive white space into just one space and trim surrounding whitespace. */
export function collapseWhiteSpace(
    input: string,
    {keepNewLines}: PartialWithUndefined<{keepNewLines: boolean}> = {},
): string {
    const newLineReplacement = keepNewLines
        ? input.replace(/[\s\n]*\n+[\s\n]*/g, '\n')
        : // sometimes \n isn't included in \s
          input.replace(/\n/g, ' ');

    return newLineReplacement
        .trim()
        .replace(/[^\S\r\n]/g, ' ')
        .replace(/\s{2,}/g, ' ');
}
