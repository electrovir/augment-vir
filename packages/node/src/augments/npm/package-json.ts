import {check} from '@augment-vir/assert';
import {filterMap, fromAsyncIterable} from '@augment-vir/common';
import {existsSync} from 'node:fs';
import {glob, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {type PackageJson} from 'type-fest';
import {findAncestor, joinFilesToDir} from '../path/ancestor.js';

/**
 * Finds all `package.json` files contained within the workspaces present in the current
 * `startDirPath`. A workspace root dir is found by recursively looking for a parent
 * `package-lock.json` file.
 *
 * @category Node : Npm
 * @category Package : @augment-vir/node
 * @throws If no directory with a `package-lock.json` file is found.
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function findAllPackageJsonFilePaths(startDirPath: string) {
    const packageRootDir = findAncestor(startDirPath, (dir) =>
        existsSync(join(dir, 'package-lock.json')),
    );

    if (!packageRootDir) {
        throw new Error(
            `Cannot find all package.json files: failed to find any directory with a package-lock.json file. Started at '${startDirPath}'.`,
        );
    }

    const rootPackageJsonPath = join(packageRootDir, 'package.json');

    return [
        rootPackageJsonPath,
        ...(await getWorkspacePackageJsonFilePaths(packageRootDir)),
    ];
}

/**
 * Get all workspace package.json paths starting at the given directory path. The output is string
 * sorted to keep it stable.
 *
 * @category Node : Npm
 * @category Package : @augment-vir/node
 * @throws Error if there is no `package.json` file at the given `rootDirPath`.
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function getWorkspacePackageJsonFilePaths(rootDirPath: string): Promise<string[]> {
    const packageJson: PackageJson = JSON.parse(
        await readFile(join(rootDirPath, 'package.json'), 'utf8'),
    );

    /* node:coverage ignore next 3: this package only uses one type of workspace */
    const patterns = check.isArray(packageJson.workspaces)
        ? packageJson.workspaces
        : packageJson.workspaces?.packages || [];

    const matchedPaths: string[] = joinFilesToDir(
        rootDirPath,
        (
            await Promise.all(
                patterns.map(async (pattern) => {
                    return await fromAsyncIterable(glob(pattern, {cwd: rootDirPath}));
                }),
            )
        ).flat(),
    );

    const workspacePackageJsonPaths = filterMap(
        matchedPaths,
        (matchedPath) => join(matchedPath, 'package.json'),
        (packageJsonPath) => existsSync(packageJsonPath),
    );

    return workspacePackageJsonPaths.sort();
}
