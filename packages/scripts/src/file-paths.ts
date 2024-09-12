import {readPackageJson} from '@augment-vir/node';
import {readdir, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';

export const monoRepoDirPath = resolve(import.meta.dirname, '..', '..', '..');
export const monoRepoNodeModulesDirPath = join(monoRepoDirPath, 'node_modules');
export const packagesDirPath = join(monoRepoDirPath, 'packages');
export const packagePaths = {
    test: join(packagesDirPath, 'test'),
    core: join(packagesDirPath, 'core'),
    scripts: join(packagesDirPath, 'scripts'),
};
const notCommittedDir = join(monoRepoDirPath, '.not-committed');
const downloadCacheDir = join(notCommittedDir, 'cache');
export const mdnDownloadCachePath = join(downloadCacheDir, 'http-status.html');
export const httpStatusOutputPath = join(
    packagePaths.core,
    'src',
    'augments',
    'http',
    'http-status.ts',
);
export const eslintTsconfigPath = join(monoRepoDirPath, 'configs', 'tsconfig.eslint.json');

export async function getAllPackageDirPaths(): Promise<string[]> {
    const packageNames = await readdir(packagesDirPath);

    const packageDirPaths = packageNames.map((packageName) => join(packagesDirPath, packageName));

    const areFolders = await Promise.all(
        packageDirPaths.map(async (path) => (await stat(path)).isDirectory()),
    );

    return packageDirPaths.filter((path, index) => areFolders[index]);
}

export async function getAllPublicPackageDirPaths(): Promise<string[]> {
    const packageDirPaths = await getAllPackageDirPaths();

    const packagePublicity = await Promise.all(
        packageDirPaths.map(async (packageDirPath) => {
            const packageJson = await readPackageJson(packageDirPath);

            const isPrivate =
                packageJson.private === true ||
                /** As any cast because npm DOES respect this value when it's a string. */
                (packageJson.private as any) === 'true';

            return !isPrivate;
        }),
    );

    return packageDirPaths.filter((value, index) => packagePublicity[index]);
}
