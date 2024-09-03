import {sep} from 'node:path';

/**
 * Convert a given path to a windows path if the current system doesn't use `/`.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function replaceWithWindowsPathIfNeeded(input: string): string {
    if (sep === '/') {
        return input;
        /** Can't test on Windows. */
        /* node:coverage ignore next 3 */
    } else {
        return input.replace(/\//g, sep);
    }
}

/**
 * Convert a Windows path to a posix path.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function toPosixPath(maybeWindowsPath: string): string {
    return maybeWindowsPath
        .replace(/^(.+?):\\+/, (match, captureGroup) => {
            return `/${captureGroup.toLowerCase()}/`;
        })
        .replace(/\\+/g, '/');
}

/**
 * Use this to interpolate paths into bash commands. If the given path is not a Windows path, the
 * path structure will not be modified.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function interpolationSafeWindowsPath(input: string): string {
    return input.replace(/\\/g, '\\\\\\\\');
}
