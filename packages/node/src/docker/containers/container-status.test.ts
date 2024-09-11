import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {docker} from '../../augments/docker.js';
import {dockerTest} from '../run-docker-test.mock.js';
import {runMockLongLivingContainer} from './run-container.mock.js';

const testContainerName = `test-${docker.container.getLogs.name}`;

describe(
    'docker.container.getLogs',
    dockerTest(() => {
        it('gets all logs', async () => {
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            const logs = await docker.container.getLogs(testContainerName);
            assert.strictEquals(logs, '');
            await docker.container.kill(testContainerName);
        });
        it('gets the last log', async () => {
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            const logs = await docker.container.getLogs(testContainerName, 1);
            assert.strictEquals(logs, '');
            await docker.container.kill(testContainerName);
        });
        it('errors if container does not exist', async () => {
            await docker.container.kill(testContainerName);
            await assert.throws(docker.container.getLogs(testContainerName, 1), {
                matchMessage: 'No such container',
            });
        });
    }),
);
