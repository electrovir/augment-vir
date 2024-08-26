import {describe, it} from '@augment-vir/test';
import {rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {monoRepoDirPath, nodePackageDir, tempWorkspaceQueryFile} from '../../file-paths.mock.js';
import {interpolationSafeWindowsPath, toPosixPath} from '../path/os-path.js';
import {runShellCommand} from '../shell.js';
import {queryNpmWorkspace} from './query-workspace.js';

describe(queryNpmWorkspace.name, () => {
    it('reads proper types', async () => {
        const data = await queryNpmWorkspace(monoRepoDirPath);

        const stringifiedData = JSON.stringify(data, null, 4);

        const tmpTsFileContent = [
            "import type {NpmWorkspace} from '@augment-vir/node';",
            `export const testQueryData: NpmWorkspace[] = ${stringifiedData};`,
        ].join('\n\n');

        await writeFile(tempWorkspaceQueryFile, tmpTsFileContent);

        const result = await runShellCommand(
            `tsc -b --pretty ${interpolationSafeWindowsPath(toPosixPath(dirname(tempWorkspaceQueryFile)))}`,
            {
                cwd: nodePackageDir,
            },
        );

        if (result.exitCode) {
            throw new Error(
                [
                    result.stdout,
                    result.stderr,
                ].join('\n'),
            );
        }

        await rm(tempWorkspaceQueryFile, {force: true});
        await rm(join(dirname(tempWorkspaceQueryFile), 'dist'), {force: true, recursive: true});
    });
});
