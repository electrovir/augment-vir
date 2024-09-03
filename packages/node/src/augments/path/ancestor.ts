import {check} from '@augment-vir/assert';
import type {MaybePromise} from '@augment-vir/common';
import {dirname, join} from 'node:path';
import {systemRootPath} from './root.js';

export function findAncestor(
    currentPath: string,
    callback: (path: string) => Promise<boolean>,
): Promise<string | undefined>;
export function findAncestor(
    currentPath: string,
    callback: (path: string) => boolean,
): string | undefined;
export function findAncestor(
    currentPath: string,
    callback: (path: string) => MaybePromise<boolean>,
): MaybePromise<string | undefined>;
/**
 * Find an ancestor file path that matches the given `callback`. If no matches are found all the way
 * up until the system root, this returns `undefined`.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @returns `undefined` if no matches are found.
 * @package @augment-vir/node
 */
export function findAncestor(
    currentPath: string,
    callback: (path: string) => MaybePromise<boolean>,
): MaybePromise<string | undefined> {
    if (currentPath === systemRootPath) {
        return undefined;
    }

    const result = callback(currentPath);

    if (check.isPromise(result)) {
        return new Promise<string | undefined>(async (resolve) => {
            const awaitedResult = await result;

            if (awaitedResult) {
                resolve(currentPath);
            } else {
                resolve(await findAncestor(dirname(currentPath), callback));
            }
        });
    } else if (result) {
        return currentPath;
    } else {
        return findAncestor(dirname(currentPath), callback);
    }
}

/**
 * Join a list of paths to the given `parentDirPath`. This is particularly useful for getting full
 * paths from the output of
 * [`readdir`](https://nodejs.org/api/fs.html#fspromisesreaddirpath-options).
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @example
 *
 * ```ts
 * import {readdir} from 'node:fs/promises';
 * import {join} from 'node:path';
 *
 * const parentDir = join('my', 'path');
 * const dirs = joinFilesToDir(parentDir, await readdir(parentDir));
 * ```
 *
 * @package @augment-vir/node
 */
export function joinFilesToDir(
    parentDirPath: string,
    childNames: ReadonlyArray<string>,
): Array<string> {
    return childNames.map((childName) => join(parentDirPath, childName));
}
