import {readdir} from 'fs/promises';
import {dirname, join} from 'path';

export const repoRootDirPath = dirname(dirname(dirname(dirname(__filename))));

export const packagesDir = join(repoRootDirPath, 'packages');

export async function readAllPublicPackageDirPaths(): Promise<ReadonlyArray<string>> {
    const packageNames = await readdir(packagesDir);

    const packageDirPaths = packageNames.map((packageName) => join(packagesDir, packageName));

    // packageDirPaths.filter();

    return packageDirPaths;
}
