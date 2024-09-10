import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {docker} from '../../augments/docker.js';
import {dockerTest} from '../run-docker-test.mock.js';
import {runMockLongLivingContainer} from './run-container.mock.js';

const testContainerName = `test-${docker.container.getInfo.name}`;

describe(
    docker.container.getInfo.name,
    dockerTest(() => {
        it('gets info', async () => {
            await docker.container.kill(testContainerName);
            await runMockLongLivingContainer(testContainerName);
            const info = await docker.container.getInfo(testContainerName);
            assert.isObject(info);
            await docker.container.kill(testContainerName);
        });
        it('returns nothing if container is not running', async () => {
            await docker.container.kill(testContainerName);
            const info = await docker.container.getInfo(testContainerName);
            assert.isUndefined(info);
        });
    }),
);
