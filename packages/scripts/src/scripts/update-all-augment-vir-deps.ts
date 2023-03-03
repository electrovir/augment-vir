import {readJson} from '@augment-vir/node-js';
import {readFile, writeFile} from 'fs/promises';
import {basename, join} from 'path';
import {PackageJson} from 'type-fest';
import {getAllPackageDirPaths, repoRootDirPath} from '../repo-paths';

export async function updateAllInternalAugmentVirDeps(): Promise<Error[]> {
    const rootPackageVersion = (await readJson<PackageJson>(join(repoRootDirPath, 'package.json')))
        ?.version;

    if (!rootPackageVersion) {
        return [new Error(`Failed to read the root package version.`)];
    }

    const packageDirPaths = await getAllPackageDirPaths();

    const errors = await Promise.all(
        packageDirPaths.map(
            async (packageDirPath) =>
                await updatePackageAugmentVirDeps(packageDirPath, rootPackageVersion),
        ),
    );

    return errors.flat();
}

async function updatePackageAugmentVirDeps(
    packageDirPath: string,
    newVersion: string,
): Promise<Error[]> {
    const packageJsonPath = join(packageDirPath, 'package.json');
    const packageJson = await readJson<PackageJson>(packageJsonPath);
    const originalPackageJsonStringContents: string = (await readFile(packageJsonPath)).toString();

    if (!packageJson) {
        return [new Error(`Found no package.json file for package '${basename(packageDirPath)}'`)];
    }

    const devDepsToUpgrade = Object.keys(packageJson.devDependencies || {}).filter((devDepName) => {
        return devDepName.startsWith('@augment-vir');
    });

    const normalDepsToUpgrade = Object.keys(packageJson.dependencies || {}).filter((depName) => {
        return depName.startsWith('@augment-vir');
    });

    const peerDepsToUpgrade = Object.keys(packageJson.peerDependencies || {}).filter(
        (peerDepName) => {
            return peerDepName.startsWith('@augment-vir');
        },
    );

    const depsToUpgrade: ReadonlyArray<string> = [
        devDepsToUpgrade,
        normalDepsToUpgrade,
        peerDepsToUpgrade,
    ].flat();

    let newPackageJsonStringContents = originalPackageJsonStringContents;

    depsToUpgrade.forEach((depToUpgrade) => {
        const findRegExp = new RegExp(`"${depToUpgrade}": "[\\w\\d\\.\\^~\\*]+"`, 'g');
        const replacement = `"${depToUpgrade}": "^${newVersion}"`;
        newPackageJsonStringContents = newPackageJsonStringContents.replace(
            findRegExp,
            replacement,
        );
    });

    await writeFile(packageJsonPath, newPackageJsonStringContents);

    return [];
}
