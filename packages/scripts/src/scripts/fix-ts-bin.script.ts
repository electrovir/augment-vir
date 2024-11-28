import {log} from '@augment-vir/common';
import {interpolationSafeWindowsPath, runShellCommand} from '@augment-vir/node';
import {rm, writeFile} from 'node:fs/promises';
import {join, sep} from 'node:path/posix';
import {monoRepoNodeModulesDirPath} from '../file-paths.js';

type PackageToFix = {
    packageName: string;
    binName: string;
    scriptPath: string;
};

const packagesToFix: ReadonlyArray<Readonly<PackageToFix>> = [
    {
        packageName: 'mono-vir',
        binName: 'mono-vir',
        scriptPath: join('mono-vir', 'src', 'cli', 'cli.script.ts'),
    },
    {
        packageName: 'virmator',
        binName: 'virmator',
        scriptPath: join('virmator', 'src', 'cli.script.ts'),
    },
    {
        packageName: 'prettier',
        binName: 'prettier',
        scriptPath: join('prettier', 'bin', 'prettier.cjs'),
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
    const binFilePath = join(monoRepoNodeModulesDirPath, '.bin', packageToFix.binName);
    await rm(binFilePath, {force: true});
    await writeFile(binFilePath, createBinFileContents(packageToFix));
    await runShellCommand(`chmod +x ${interpolationSafeWindowsPath(binFilePath)}`);
    log.success(`Fixed ${packageToFix.packageName} bin.`);
}

await Promise.all(packagesToFix.map(async (packageToFix) => await fixTsBin(packageToFix)));
