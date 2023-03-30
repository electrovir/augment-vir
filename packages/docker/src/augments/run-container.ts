import {logIf, runShellCommand} from '@augment-vir/node-js';
import {
    EnvMap,
    PortMap,
    VolumeMap,
    combineCommandAndFlags,
    makeEnvFlags,
    makePortMapFlags,
    makeVolumeFlags,
} from './docker-command-inputs';
import {waitForContainerToBeRemoved} from './is-container-running';
import {killContainer} from './kill-container';

export type RunContainerInputs = {
    imageName: string;
    detach: boolean;
    command?: string;
    enableLogging: boolean;
    containerName: string;
    volumeMapping?: ReadonlyArray<VolumeMap> | undefined;
    portMapping?: ReadonlyArray<PortMap> | undefined;
    envMapping?: EnvMap | undefined;
    executionEnv?: Record<string, string>;
    removeWhenDone?: boolean;
    extraDockerInputs?: ReadonlyArray<string>;
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
    enableLogging,
    removeWhenDone,
    useCurrentUser,
    extraDockerInputs = [],
}: RunContainerInputs) {
    try {
        const portMapFlags = makePortMapFlags(portMapping);
        const envFlags = makeEnvFlags(envMapping);
        const detachFlag = detach ? '-d' : '';
        const containerNameFlag = containerName ? `--name='${containerName}'` : '';
        const volumeMapFlags = makeVolumeFlags(volumeMapping);
        const rmFlag = removeWhenDone ? '--rm' : '';
        const userFlag = useCurrentUser ? '--user "$(id -u)":"$(id -g)"' : '';

        const fullCommand = combineCommandAndFlags([
            'docker',
            'run',
            portMapFlags,
            userFlag,
            volumeMapFlags,
            envFlags,
            rmFlag,
            detachFlag,
            containerNameFlag,
            ...extraDockerInputs,
            imageName,
            command,
        ]);

        const nameLog = containerName ? ` with name "${containerName}"` : '';
        logIf.info(enableLogging, `Running "${imageName}" container${nameLog}...`);

        await runShellCommand(fullCommand, {
            env: executionEnv,
            rejectOnError: true,
        });

        if (removeWhenDone) {
            await killContainer(containerName);
            await waitForContainerToBeRemoved(containerName);
        }
    } catch (error) {
        await killContainer(containerName);
        throw error;
    }
}
