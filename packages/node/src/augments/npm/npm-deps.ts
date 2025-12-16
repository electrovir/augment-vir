import {check} from '@augment-vir/assert';
import {filterMap, getEnumValues, getObjectTypedEntries, getOrSet} from '@augment-vir/common';
import {type PackageJson} from 'type-fest';
import {readJsonFile} from '../fs/json.js';
import {findAllPackageJsonFilePaths} from './package-json.js';

/**
 * All `package.json` keys that are parsed as direct dependencies.
 *
 * @category Internal
 */
export enum PackageJsonDependencyKey {
    DevDependencies = 'devDependencies',
    Dependencies = 'dependencies',
    PeerDependencies = 'peerDependencies',
    Overrides = 'overrides',
}

/**
 * A record of package names to package versions included in the direct dependencies. This is the
 * output from {@link listAllDirectNpmDeps}.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type NpmDeps = Record<string, NpmDep[]>;

/**
 * An individual dependency used in {@link NpmDeps}.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type NpmDep = {
    /** Path to the `package.json` file that depends on this. */
    requiredBy: string;
    dependencyKey: PackageJsonDependencyKey;
    /**
     * The version as it is directly noted in the `package.json` file. This might not necessarily
     * correlate to any actually published versions.
     */
    versionValue: string;
    /** If true, this dependency is part of the workspace's own packages. */
    isWorkspace: boolean;
};

/**
 * Finds all direct deps for the workspace at, or that contains, the given dir path.
 *
 * @category Node : Npm
 * @category Package : @augment-vir/node
 * @throws If no directory with a `package-lock.json` file is found.
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function listAllDirectNpmDeps(startDirPath: string): Promise<NpmDeps> {
    const packageJsonFilePaths = await findAllPackageJsonFilePaths(startDirPath);

    const deps: NpmDeps = {};

    const packageJsonFiles = await Promise.all(
        packageJsonFilePaths.map(async (packageJsonFilePath) => {
            return {
                packageJsonFilePath,
                packageJson: (await readJsonFile(packageJsonFilePath)) as PackageJson,
            };
        }),
    );

    const allWorkspacePackageNames = filterMap(
        packageJsonFiles,
        (packageJsonFile) => packageJsonFile.packageJson.name,
        check.isTruthy,
    );

    packageJsonFiles.forEach(({packageJson, packageJsonFilePath}) => {
        getEnumValues(PackageJsonDependencyKey).forEach((dependencyKey) => {
            getObjectTypedEntries(packageJson[dependencyKey] || {}).forEach(
                ([
                    dependencyName,
                    versionValue,
                ]) => {
                    if (typeof versionValue === 'string') {
                        getOrSet(deps, String(dependencyName), () => []).push({
                            dependencyKey,
                            requiredBy: packageJsonFilePath,
                            versionValue,
                            isWorkspace: allWorkspacePackageNames.includes(String(dependencyName)),
                        });
                    }
                },
            );
        });
    });

    return deps;
}
