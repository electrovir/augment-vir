import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {docker} from '../../augments/docker.js';
import {dockerTest} from '../run-docker-test.mock.js';
import {runMockLongLivingContainer} from './run-container.mock.js';

const testContainerName = `test-${docker.container.tryOrKill.name}`;

describe(
    docker.container.tryOrKill.name,
    dockerTest(() => {
        it('runs without failure', async () => {
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            const result = await docker.container.tryOrKill(testContainerName, (containerName) => {
                assert.strictEquals(containerName, testContainerName);
                return 'hi';
            });

            await docker.container.waitUntilRunning(testContainerName);
            await docker.container.kill(testContainerName);
            await docker.container.waitUntilExited(testContainerName);

            assert.tsType(result).equals<string>();
            assert.strictEquals(result, 'hi');
        });

        it('runs with failure', async () => {
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            await assert.throws(
                docker.container.tryOrKill(testContainerName, () => {
                    throw new Error('fake error');
                }),
            );

            await docker.container.waitUntilRemoved(testContainerName);
        });
    }),
);
