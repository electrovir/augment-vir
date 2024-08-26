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

export function joinFilesToDir(
    parentDirPath: string,
    childNames: ReadonlyArray<string>,
): Array<string> {
    return childNames.map((childName) => join(parentDirPath, childName));
}
