import {readJson} from '@augment-vir/node-js';
import {readdir, stat} from 'fs/promises';
import {dirname, join} from 'path';
import {PackageJson} from 'type-fest';

export const repoRootDirPath = dirname(dirname(dirname(dirname(__filename))));

export const packagesDirPath = join(repoRootDirPath, 'packages');

export async function getAllPackageDirPaths(): Promise<ReadonlyArray<string>> {
    const packageNames = await readdir(packagesDirPath);

    const packageDirPaths = packageNames.map((packageName) => join(packagesDirPath, packageName));

    const areFolders = await Promise.all(
        packageDirPaths.map(async (path) => (await stat(path)).isDirectory()),
    );

    return packageDirPaths.filter((path, index) => areFolders[index]);
}

export async function getAllPublicPackageDirPaths(): Promise<ReadonlyArray<string>> {
    const packageDirPaths = await getAllPackageDirPaths();

    const packagePublicity = await Promise.all(
        packageDirPaths.map(async (packageDirPath) => {
            const packageJson: PackageJson | undefined = await readJson(
                join(packageDirPath, 'package.json'),
            );

            if (!packageJson) {
                return false;
            }

            if (
                packageJson.private === true ||
                // as any cast because npm DOES respect this value when it's a string
                (packageJson.private as any) === 'true'
            ) {
                return false;
            }

            return true;
        }),
    );

    return packageDirPaths.filter((value, index) => packagePublicity[index]);
}
