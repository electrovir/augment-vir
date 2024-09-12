import {assert, waitUntil} from '@augment-vir/assert';
import {runShellCommand} from '../../augments/terminal/shell.js';

export async function getContainerLogs(
    containerNameOrId: string,
    latestLineCount?: number,
): Promise<string> {
    const latestLinesArg = latestLineCount == undefined ? '' : `--tail ${latestLineCount}`;
    const logResult = await runShellCommand(
        `docker logs ${latestLinesArg} '${containerNameOrId}'`,
        {rejectOnError: true},
    );
    return logResult.stdout;
}

/**
 * All possible statuses for an existing container.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export enum DockerContainerStatus {
    Created = 'created',
    Running = 'running',
    Paused = 'paused',
    Restarting = 'restarting',
    Exited = 'exited',
    Removing = 'removing',
    Dead = 'dead',

    /** This is not a native Docker status but indicates that the container does not exist. */
    Removed = 'removed',
}

/**
 * Statuses from {@link DockerContainerStatus} that indicate that a container has been exited in some
 * way.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export const exitedDockerContainerStatuses = [
    DockerContainerStatus.Dead,
    DockerContainerStatus.Removed,
    DockerContainerStatus.Exited,
];

export async function getContainerStatus(
    containerNameOrId: string,
): Promise<DockerContainerStatus> {
    const statusResult = await runShellCommand(
        `docker container inspect -f '{{.State.Status}}' '${containerNameOrId}'`,
    );

    if (statusResult.exitCode !== 0) {
        return DockerContainerStatus.Removed;
    }

    const status = statusResult.stdout.trim();
    assert.isEnumValue(status, DockerContainerStatus, 'Unexpected container status value');

    return status;
}

export async function waitUntilContainerRunning(
    containerNameOrId: string,
    failureMessage?: string | undefined,
): Promise<void> {
    await waitUntil.isTrue(
        async (): Promise<boolean> => {
            /** Check if logs can be accessed yet. */
            await getContainerLogs(containerNameOrId, 1);
            const status = await getContainerStatus(containerNameOrId);

            return status === DockerContainerStatus.Running;
        },
        {},
        failureMessage,
    );
}

export async function waitUntilContainerRemoved(
    containerNameOrId: string,
    failureMessage?: string | undefined,
): Promise<void> {
    await waitUntil.isTrue(
        async (): Promise<boolean> => {
            const status = await getContainerStatus(containerNameOrId);
            return status === DockerContainerStatus.Removed;
        },
        {},
        failureMessage,
    );
}

export async function waitUntilContainerExited(
    containerNameOrId: string,
    failureMessage?: string | undefined,
): Promise<void> {
    await waitUntil.isTrue(
        async (): Promise<boolean> => {
            const status = await getContainerStatus(containerNameOrId);
            return exitedDockerContainerStatuses.includes(status);
        },
        {},
        failureMessage,
    );
}
