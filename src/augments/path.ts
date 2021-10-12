import {sep} from 'path';

/** Get (or at least use a best attempt) to get the current package's absolute path. */
export function getRepoRootDir(): string {
    return __dirname.replace(/(?:src|node_modules\/augment-vir|dist).*/, '');
}

/** Convert a given path to a windows path if the current system doesn't use `/`. */
export function replaceWithWindowsPathIfNeeded(input: string): string {
    if (sep === '/') {
        return input;
    } else {
        return input.replace(/\//g, sep);
    }
}

/** Convert a Windows path to a posix path. */
export function toPosixPath(maybeWindowsPath: string): string {
    return maybeWindowsPath
        .replace(/^(.+?)\:\\+/, (match, captureGroup) => {
            return `/${captureGroup.toLowerCase()}/`;
        })
        .replace(/\\+/g, '/');
}

/**
 * Use this to interpolate paths into bash commands. If the given path is not a window path, the
 * path structure will not be modified.
 */
export function interpolationSafeWindowsPath(input: string): string {
    return input.replace(/\\/g, '\\\\\\\\');
}
