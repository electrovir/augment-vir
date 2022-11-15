import {readdir} from 'fs/promises';
import {dirname, join} from 'path';

export const repoRootDirPath = dirname(dirname(dirname(dirname(__filename))));

export const packagesDir = join(repoRootDirPath, 'packages');

export async function readAllPackageDirPaths(): Promise<ReadonlyArray<string>> {
    const dirs = await readdir(packagesDir);

    return dirs;
}
