/* node:coverage disable */

/**
 * This script is used to replace all `/src/` imports with `/dist/`. This is used for making a
 * compiled, but not bundled (because that would affect relative file path variables), backend
 * mono-repo be able to run without `tsx`. (Because `tsx` uses a lot more memory than plain
 * `node`.)
 *
 * To use this script properly, call it after compiling your backend. It should be run from your
 * mono-repo root. Like this:
 *
 * ```json
 * {
 *     "scripts": {
 *         "build:backend": "npm run compile && npx tsx node_modules/@augment-vir/node/src/scripts/fix-src-imports.script.ts"
 *     }
 * }
 * ```
 */

import {assert, check} from '@augment-vir/assert';
import {filterMap, log, type JsonCompatibleObject} from '@augment-vir/common';
import {joinFilesToDir, readJsonFile, runShellCommand, writeJsonFile} from '@augment-vir/node';
import {readFile, writeFile} from 'node:fs/promises';
import {join, relative} from 'node:path';
import {queryNpmWorkspace} from '../augments/npm/query-workspace.js';

const propertiesToReplace = [
    'main',
    'module',
];

async function findFilesThatNeedImportFixes(monoRepoPath: string) {
    const {stdout} = await runShellCommand(
        'find . -type d -name "node_modules" -prune -o -type f -path "*/dist/*.js" -exec grep -lE "from \'.*?/src/.*?\';" {} +',
        {
            cwd: monoRepoPath,
        },
    );

    const files = filterMap(stdout.trim().split('\n'), (line) => line.trim(), check.isTruthy);

    return joinFilesToDir(monoRepoPath, files);
}

async function updateAllPackageJsonPaths(monoRepoPath: string) {
    const workspaces = await queryNpmWorkspace(monoRepoPath);

    await Promise.all(
        workspaces.map(async (workspace) => {
            const packageJsonPath = join(workspace.path, 'package.json');
            const packageJson = (await readJsonFile(packageJsonPath)) as unknown;

            assert.isObject(packageJson);
            let modified = false as boolean;

            propertiesToReplace.forEach((property) => {
                if (property in packageJson && check.isString(packageJson[property])) {
                    modified = true;
                    packageJson[property] = packageJson[property]
                        .replace('src/', 'dist/')
                        .replace('.ts', '.js');
                }
            });

            if (modified) {
                await writeJsonFile(packageJsonPath, packageJson as JsonCompatibleObject);
                log.faint(`Updated ${relative(monoRepoPath, packageJsonPath)}`);
            }
        }),
    );
}

async function fixAllSrcImports(monoRepoPath: string) {
    const filePaths = await findFilesThatNeedImportFixes(monoRepoPath);

    await Promise.all(
        filePaths.map(async (filePath) => {
            const contents = await readFile(filePath, 'utf8');
            const fixedContents = contents.replaceAll(
                /(from ["'][^'"]+?)\/src\/([^'"]+)['"];/g,
                "$1/dist/$2';",
            );
            await writeFile(filePath, fixedContents);
            log.faint(`Fixed imports in ${relative(monoRepoPath, filePath)}`);
        }),
    );
}

async function fixAll(monoRepoPath: string) {
    await Promise.all([
        updateAllPackageJsonPaths(monoRepoPath),
        fixAllSrcImports(monoRepoPath),
    ]);
}

await fixAll(process.cwd());
