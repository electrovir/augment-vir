import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {docker} from '../../augments/docker.js';
import {dockerTest} from '../run-docker-test.mock.js';
import {runMockLongLivingContainer} from './run-container.mock.js';

const testContainerName = `test-${docker.container.run.name}`;
const testImageName = 'alpine:3.20.2';

describe(
    'docker.container.run',
    dockerTest(() => {
        it('starts a detached container', async () => {
            await docker.container.waitUntilRemoved(testContainerName);

            await runMockLongLivingContainer(testContainerName);
            await docker.container.waitUntilRunning(testContainerName);
            await docker.container.kill(testContainerName);
            await docker.container.waitUntilExited(testContainerName);
        });
        it('starts a non-detached container', async () => {
            await docker.container.waitUntilRemoved(testContainerName);

            await docker.container.run({
                containerName: testContainerName,
                detach: false,
                imageName: testImageName,
                removeWhenDone: true,
                platform: 'amd64',
            });
            await docker.container.waitUntilExited(testContainerName);
        });
        it('removes a container after running a command', async () => {
            await docker.container.waitUntilRemoved(testContainerName);

            await docker.container.run({
                containerName: testContainerName,
                detach: true,
                imageName: testImageName,
                removeWhenDone: true,
                platform: 'amd64',
            });
            await docker.container.waitUntilExited(testContainerName);
        });
        it('errors out with a custom command', async () => {
            await docker.container.waitUntilRemoved(testContainerName);

            await assert.throws(
                docker.container.run({
                    containerName: testContainerName,
                    detach: false,
                    imageName: testImageName,
                    useCurrentUser: true,
                    removeWhenDone: true,
                    command: 'random-command-this-does-not-exist-please-electrovir',
                    platform: 'amd64',
                }),
                {
                    matchMessage:
                        'exec: "random-command-this-does-not-exist-please-electrovir": executable file not found',
                },
            );
            await docker.container.waitUntilExited(testContainerName);
        });
    }),
);
