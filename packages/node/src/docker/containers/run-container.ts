import {check} from '@augment-vir/assert';
import {runShellCommand} from '../../augments/terminal/shell.js';
import {updateImage} from '../docker-image.js';
import {waitUntilContainerRunning} from './container-status.js';
import {
    DockerEnvMap,
    DockerPortMap,
    DockerVolumeMap,
    makeEnvFlags,
    makePortMapFlags,
    makeVolumeFlags,
} from './docker-command-inputs.js';
import {killContainer} from './kill-container.js';

export type RunDockerContainerParams = {
    imageName: string;
    detach: boolean;
    command?: string;
    containerName: string;
    volumeMapping?: ReadonlyArray<DockerVolumeMap> | undefined;
    portMapping?: ReadonlyArray<DockerPortMap> | undefined;
    envMapping?: DockerEnvMap | undefined;
    executionEnv?: Record<string, string>;
    removeWhenDone?: boolean;
    dockerFlags?: ReadonlyArray<string>;
    useCurrentUser?: boolean;
};

export async function runContainer({
    containerName,
    imageName,
    detach,
    command,
    portMapping,
    volumeMapping,
    envMapping,
    executionEnv,
    removeWhenDone,
    useCurrentUser,
    dockerFlags = [],
}: RunDockerContainerParams) {
    try {
        const portMapFlags = makePortMapFlags(portMapping);
        const envFlags = makeEnvFlags(envMapping);
        const detachFlag = detach ? '-d' : '';
        const volumeMapFlags = makeVolumeFlags(volumeMapping);
        const rmFlag = removeWhenDone ? '--rm' : '';
        const userFlag = useCurrentUser ? '--user "$(id -u)":"$(id -g)"' : '';

        await updateImage(imageName);

        const fullCommand = [
            'docker',
            'run',
            portMapFlags,
            userFlag,
            volumeMapFlags,
            envFlags,
            rmFlag,
            detachFlag,
            `--name='${containerName}'`,
            ...dockerFlags,
            imageName,
            command,
        ]
            .filter(check.isTruthy)
            .join(' ');

        await runShellCommand(fullCommand, {
            env: executionEnv,
            rejectOnError: true,
        });

        if (removeWhenDone) {
            await killContainer(containerName);
        } else if (detach) {
            await waitUntilContainerRunning(containerName);
        }
    } catch (error) {
        await killContainer(containerName);
        throw error;
    }
}
