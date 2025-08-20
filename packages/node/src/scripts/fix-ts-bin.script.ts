/* node:coverage disable */

/**
 * This script is used to replace `node_modules/.bin` files so that they run with typescript. This
 * is used in dev for packages that are dependencies of the listed packages (in `packagesToFix`),
 * such as `augment-vir` itself.
 *
 * To use this script properly, call it directly in your postinstall script. Like this:
 *
 * ```json
 * {
 *     "scripts": {
 *         "postinstall": "tsx node_modules/@augment-vir/node/src/scripts/fix-ts-bin.script.ts"
 *     }
 * }
 * ```
 */

import {log} from '@augment-vir/common';
import {interpolationSafeWindowsPath, runShellCommand} from '@augment-vir/node';
import {readFile, rm, writeFile} from 'node:fs/promises';
import {join, sep} from 'node:path/posix';

type PackageToFix = {
    packageName: string;
    binName: string;
    scriptPath: string;
    fixImport: boolean;
};

const packagesToFix: ReadonlyArray<Readonly<PackageToFix>> = [
    {
        packageName: 'runstorm',
        binName: 'runstorm',
        scriptPath: join('runstorm', 'src', 'cli', 'cli.script.ts'),
        fixImport: true,
    },
    {
        packageName: 'mono-vir',
        binName: 'mono-vir',
        scriptPath: join('mono-vir', 'src', 'cli', 'cli.script.ts'),
        fixImport: true,
    },
    {
        packageName: 'virmator',
        binName: 'virmator',
        scriptPath: join('virmator', 'src', 'cli.script.ts'),
        fixImport: true,
    },
    {
        packageName: 'prettier',
        binName: 'prettier',
        scriptPath: join('prettier', 'bin', 'prettier.cjs'),
        fixImport: false,
    },
];

function createBinFileContents({scriptPath}: Readonly<Pick<PackageToFix, 'scriptPath'>>): string {
    return [
        '#!/bin/bash',
        '',
        `npx tsx "$(dirname "$(dirname "$(readlink -f "$0")")")${sep}${scriptPath}" "$@"`,
    ].join('\n');
}

async function fixTsBin(packageToFix: Readonly<PackageToFix>) {
    const binFilePath = join(process.cwd(), 'node_modules', '.bin', packageToFix.binName);
    await rm(binFilePath, {force: true});
    await writeFile(binFilePath, createBinFileContents(packageToFix));
    await runShellCommand(`chmod +x ${interpolationSafeWindowsPath(binFilePath)}`);
    await fixPackageJson(packageToFix);
    log.success(`Fixed ${packageToFix.packageName} bin.`);
}

async function fixPackageJson(packageToFix: Readonly<PackageToFix>) {
    if (!packageToFix.fixImport) {
        return;
    }

    const packageJsonPath = join(
        process.cwd(),
        'node_modules',
        packageToFix.packageName,
        'package.json',
    );
    const original = String(await readFile(packageJsonPath));
    await writeFile(
        packageJsonPath,
        original
            .replace('"main": "dist/index.js"', '"main": "src/index.ts"')
            .replace('"module": "dist/index.js"', '"module": "src/index.ts"'),
    );
}

await Promise.all(packagesToFix.map(async (packageToFix) => await fixTsBin(packageToFix)));
