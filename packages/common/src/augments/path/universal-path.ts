import {isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import {wrapInTry} from '../function/wrap-in-try.js';
import {addPrefix} from '../string/prefix.js';

/**
 * Replaces a path's extension with a new one. If the original path has no extension, `newExtension`
 * will be appended.
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {replaceExtension} from '@augment-vir/common';
 *
 * replaceExtension({path: '/users/stuff/file.ts?tail', newExtension: '.js'});
 * // '/users/stuff/file.js?tail'
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function replaceExtension({
    newExtension,
    path,
}: Readonly<{path: string; newExtension: string}>): string {
    const {basename, dirname, tail} = extractExtension(path);

    return [
        dirname,
        basename,
        addPrefix({value: newExtension, prefix: '.'}),
        tail,
    ].join('');
}

/**
 * Checks if the given path contains an extension.
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {hasExtension} from '@augment-vir/common';
 *
 * hasExtension('/users/stuff/file.ts?tail'); // true
 * hasExtension('/users/stuff/file?tail'); // false
 * ```
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function hasExtension(path: string): boolean {
    return !!extractExtension(path).extension;
}

/**
 * Type for `sep` or path separators. Either `'/'` or `'\'`.
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Sep = '/' | '\\';

/**
 * The default `sep` or path separator for use with universal (Node.js and browser supported) path
 * operations. In the browser, this uses `'/'`. In Node.js, `node:path.sep` is used.
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const defaultSep: Sep = isRuntimeEnv(RuntimeEnv.Web)
    ? '/'
    : await wrapInTry(async () => (await import('node:path')).sep, {fallbackValue: '/'});

/**
 * Extracts a path's extension, amongst other things, from the given path, without relying on
 * Node.js built-in packages (this works in a browser).
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {extractExtension} from '@augment-vir/common';
 *
 * const results = extractExtension('/users/stuff/file.ts?tail');
 *
 * // results = {
 * //     basename: 'file',
 * //     dirname: '/users/stuff/',
 * //     extension: '.ts',
 * //     tail: '?tail',
 * // }
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function extractExtension(
    path: string,
    /**
     * By default, the path separator is determined by {@link defaultSep}. With this input you can
     * override the path separator in use.
     */
    sepOverride?: '/' | '\\' | undefined,
): {
    /**
     * The part of the path that is the path to the file. This will be an empty string if there is
     * none. Includes the all trailing and leading slashes, if they exist in `path`.
     */
    dirname: string;
    /**
     * The file name itself. This will only be an empty string if the given `path` is itself empty.
     * This does not include the extension.
     */
    basename: string;
    /**
     * The extension extracted from the path. This will be an empty string if there is no extension.
     * This includes a leading dot, if an extension exists.
     */
    extension: string;
    /**
     * Any query `'?'` and/or hash `'#'` data in the given `path`. This will be an empty string if
     * no query or hash data exists in the given `path`. Includes the leading `'?'` or `'#'`.
     */
    tail: string;
} {
    const sep = sepOverride || defaultSep;

    const queryIndex = path.indexOf('?');
    const hashIndex = path.indexOf('#');
    const headTailSplitIndex =
        hashIndex === -1
            ? queryIndex
            : queryIndex === -1
              ? hashIndex
              : Math.min(hashIndex, queryIndex);
    const head = headTailSplitIndex === -1 ? path : path.slice(0, headTailSplitIndex);
    const tail = headTailSplitIndex === -1 ? '' : path.slice(headTailSplitIndex);

    const lastSep = head.lastIndexOf(sep);
    /** Includes last slash (if present). */
    const dirname = head.slice(0, lastSep + 1);
    const basename = head.slice(lastSep + 1);

    const dotIndex = basename.lastIndexOf('.');

    return {
        dirname,
        basename: dotIndex > 0 ? basename.slice(0, dotIndex) : basename,
        extension: dotIndex > 0 ? basename.slice(dotIndex) : '',
        tail,
    };
}
