import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {docker} from '../../augments/docker.js';
import {DockerContainerStatus} from './container-status.js';
import {runMockLongLivingContainer} from './run-container.mock.js';

const testContainerName = `test-${docker.container.kill.name}`;

describe(docker.container.kill.name, () => {
    it('kills a container', async () => {
        await docker.container.kill(testContainerName);
        await runMockLongLivingContainer(testContainerName);
        await docker.container.kill(testContainerName);
    });
    it('kills a container without removing it', async () => {
        await docker.container.kill(testContainerName);
        await runMockLongLivingContainer(testContainerName);
        await docker.container.kill(testContainerName, {keepContainer: true});
        assert.strictEquals(
            await docker.container.getStatus(testContainerName),
            DockerContainerStatus.Exited,
        );
        await docker.container.kill(testContainerName);
    });
});
