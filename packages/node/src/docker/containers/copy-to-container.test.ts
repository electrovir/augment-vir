import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {readFile} from 'node:fs/promises';
import {docker} from '../../augments/docker.js';
import {recursiveFileReadDir, workspaceQueryPackageJsonPath} from '../../file-paths.mock.js';
import {dockerTest} from '../run-docker-test.mock.js';
import {runMockLongLivingContainer} from './run-container.mock.js';

const testContainerName = `test-${docker.container.copyTo.name}`;

describe(
    docker.container.copyTo.name,
    dockerTest(() => {
        it('copies a file', async () => {
            const copyToPath = '/tmp/hi.json';
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            await docker.container.copyTo({
                containerAbsolutePath: copyToPath,
                containerNameOrId: testContainerName,
                hostPath: workspaceQueryPackageJsonPath,
            });
            const results = await docker.container.runCommand({
                command: `cat ${copyToPath}`,
                containerNameOrId: testContainerName,
            });
            assert.strictEquals(
                results.stdout,
                (await readFile(workspaceQueryPackageJsonPath)).toString(),
            );
            await docker.container.kill(testContainerName);
        });
        it('copies a dir', async () => {
            const copyToPath = '/tmp/whole-dir';
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            await docker.container.copyTo({
                containerAbsolutePath: copyToPath,
                containerNameOrId: testContainerName,
                hostPath: recursiveFileReadDir,
            });
            const results = await docker.container.runCommand({
                command: `ls -la ${copyToPath} | awk '{print $9}'`,
                containerNameOrId: testContainerName,
            });
            assert.deepEquals(results.stdout.trim().split('\n').sort(), [
                '.',
                '..',
                'a-file.txt',
                'b-file.txt',
                'inner-dir',
            ]);
            await docker.container.kill(testContainerName);
        });
    }),
);
