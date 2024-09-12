import {awaitedForEach} from '@augment-vir/common';
import {interpolationSafeWindowsPath} from '../augments/path/os-path.js';
import {runShellCommand} from '../augments/terminal/shell.js';
import {
    generatedPrismaClientDirPath,
    notCommittedDirPath,
    testPrismaMigrationsDirPath,
} from '../file-paths.mock.js';

const pathsToDelete = [
    generatedPrismaClientDirPath,
    notCommittedDirPath,
    testPrismaMigrationsDirPath,
];

export async function clearTestDatabaseOutputs() {
    await awaitedForEach(pathsToDelete, async (pathToDelete) => {
        /**
         * This way of deleting files is required for Windows tests running on GitHub Actions.
         * Otherwise, we get the following error:
         *
         *     EPERM: operation not permitted, unlink 'D:\a\augment-vir\augment-vir\packages\node\node_modules\.prisma\query_engine-windows.dll.node'
         */
        await runShellCommand(`sudo rm -rf ${interpolationSafeWindowsPath(pathToDelete)}`, {
            rejectOnError: true,
        });
    });
}
