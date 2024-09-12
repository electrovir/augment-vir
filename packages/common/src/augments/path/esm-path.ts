import {removeSuffix} from '../string/suffix.js';

/**
 * Creates the equivalent of CJS's
 * [`__dirname`](https://nodejs.org/docs/latest/api/globals.html#__dirname) and
 * [`__filename`](https://nodejs.org/docs/latest/api/globals.html#__filename) for ESM modules.
 *
 * This is the equivalent of
 * [`import.meta.dirname`](https://nodejs.org/api/esm.html#importmetadirname) and
 * [`import.meta.filename`](https://nodejs.org/api/esm.html#importmetafilename) added to Node.js
 * v20.11.0 but is compatible with older versions of Node.js as well as browsers.
 *
 * @category Path : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {getEsmPath} from '@augment-vir/common';
 *
 * const {filePath, dirPath} = getEsmPath(import.meta);
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getEsmPath(importMeta: ImportMeta): {filePath: string; dirPath: string} {
    const filePath = new URL('', importMeta.url).pathname;
    const dirPath = removeSuffix({value: new URL('.', importMeta.url).pathname, suffix: '/'});

    return {
        filePath,
        dirPath,
    };
}
