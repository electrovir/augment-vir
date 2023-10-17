import {unlink, writeFile} from 'fs/promises';
import {
    augmentVirRepoDirPath,
    nodeJsPackageDir,
    tempWorkspaceQueryFile,
} from '../../repo-file-paths.test-helpers';
import {interpolationSafeWindowsPath, toPosixPath} from '../path';
import {runShellCommand} from '../shell';
import {queryNpmWorkspace} from './query-workspace';

describe(queryNpmWorkspace.name, () => {
    it('reads proper types', async () => {
        const data = await queryNpmWorkspace(augmentVirRepoDirPath);

        const stringifiedData = JSON.stringify(data, null, 4);

        const tmpTsFileContent = [
            "import type {NpmWorkspace} from '../src/augments/npm/query-workspace';",
            `const testQueryData: NpmWorkspace[] = ${stringifiedData};`,
        ].join('\n');

        const tempFilePath = tempWorkspaceQueryFile;

        await writeFile(tempFilePath, tmpTsFileContent);

        const result = await runShellCommand(
            `tsc --noEmit ${interpolationSafeWindowsPath(toPosixPath(tempFilePath))}`,
            {
                cwd: nodeJsPackageDir,
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

        await unlink(tempFilePath);
    });
});
