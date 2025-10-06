/* eslint-disable unicorn/prefer-code-point */
/* eslint-disable sonarjs/no-control-regex */
/* eslint-disable no-control-regex */

import {getByteLength} from '../string/length.js';
import {safeSplit} from '../string/split.js';
import {collapseWhiteSpace} from '../string/white-space.js';
import {extractExtension} from './universal-path.js';

/**
 * Sanitize a file path for use within Linux, macOS, or Windows file systems.
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function sanitizeFilePath(original: string | null | undefined): string | undefined {
    if (!original) {
        return undefined;
    }
    const sanitized = sanitizeFileName(
        collapseWhiteSpace(original)
            .replaceAll(' ', '_')
            /** This ESLint error is wrong. */
            .replaceAll(/['()*"![\]{}\s?=&<>:/\-\\|]/g, '_')
            .replaceAll(/_{2,}/g, '_')
            .replace(/_$/, '')
            .replace(/\.$/, '')
            .replaceAll(/_\./g, '.')
            .replace(/^_+/, '')
            .replace(/^\.+/, '')
            .toLowerCase(),
    ).trim();

    const extension = extractExtension(sanitized).extension;

    if (extension) {
        return [
            safeSplit(sanitized, extension)[0],
            extension.replaceAll('_', ''),
        ].join('');
    } else {
        return sanitized || undefined;
    }
}

/** The following code is not written by us, we do not care about code coverage on it. */
/* node:coverage disable */

/**
 * The following code is copied from the
 * [`sanitize-filename`](https://www.npmjs.com/package/sanitize-filename/v/1.6.3) package at
 * https://github.com/parshap/node-sanitize-filename/blob/88bba56da0bad941ea5c8302983dc66af331c7e9/index.js
 * and modified to match our conventions and make it browser friendly.
 */

const illegalRe = /[/?<>\\:*|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i;

type Replacer = string | ((substring: string, ...args: any[]) => string);

function internalSanitizeFileName(input: string, replacement: Replacer) {
    /**
     * These as casts are necessary because `.replace` is not typed correctly in the TypeScript
     * library.
     *
     * @see https://github.com/microsoft/TypeScript/issues/54387
     */
    const sanitized = input
        .replace(illegalRe, replacement as string)
        .replace(controlRe, replacement as string)
        .replace(reservedRe, replacement as string)
        .replace(windowsReservedRe, replacement as string);
    return truncate(sanitized, 255);
}

function sanitizeFileName(
    input: string,
    {
        replacement,
    }: {
        replacement?: Replacer;
    } = {},
) {
    return internalSanitizeFileName(internalSanitizeFileName(input, replacement || ''), '');
}

/**
 * The following code is copied from the
 * [`truncate-utf8-bytes`](https://www.npmjs.com/package/truncate-utf8-bytes/v/1.0.2) package at
 * https://github.com/parshap/truncate-utf8-bytes/blob/c8fcebc8be093c8bd8db1e7d75c09b9fce7e4708/lib/truncate.js
 * and modified to match our conventions and make it browser friendly.
 */

function isHighSurrogate(charCode: number) {
    return charCode >= 0xd8_00 && charCode <= 0xdb_ff;
}

function isLowSurrogate(charCode: number) {
    return charCode >= 0xdc_00 && charCode <= 0xdf_ff;
}

function truncate(string: string, byteLength: number) {
    const charLength = string.length;
    let curByteLength = 0;
    let codePoint;
    let segment: string;

    for (let i = 0; i < charLength; i += 1) {
        codePoint = string.charCodeAt(i);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        segment = string[i]!;

        if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
            // eslint-disable-next-line sonarjs/updated-loop-counter
            i += 1;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            segment += string[i]!;
        }

        curByteLength += getByteLength(segment);

        if (curByteLength === byteLength) {
            return string.slice(0, i + 1);
        } else if (curByteLength > byteLength) {
            return string.slice(0, i - segment.length + 1);
        }
    }

    return string;
}
