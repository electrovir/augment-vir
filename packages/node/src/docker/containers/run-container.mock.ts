import {docker} from '../../augments/docker.js';
import {RunDockerContainerParams} from './run-container.js';

export async function runMockLongLivingContainer(
    containerName: string,
    args: Partial<RunDockerContainerParams> = {},
) {
    await docker.container.run({
        containerName: containerName,
        detach: true,
        imageName: 'alpine:3.20.2',
        dockerFlags: [
            '-i',
            '-t',
        ],
        command: 'sh',
        ...args,
    });
}
