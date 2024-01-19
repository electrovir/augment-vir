import {waitUntilTruthy} from '@augment-vir/common';
import {logIf, runShellCommand} from '@augment-vir/node-js';
import {getContainerInfo} from './container-info';
import {killContainer} from './kill-container';

export async function isContainerResponding(containerNameOrId: string): Promise<boolean> {
    const results = await runShellCommand(`docker logs '${containerNameOrId}'`);

    return results.exitCode === 0;
}

export async function waitForContainerToBeResponsive(containerNameOrId: string): Promise<void> {
    await waitUntilTruthy(() => {
        return isContainerResponding(containerNameOrId);
    });
}

export async function waitForContainerToBeRemoved(containerNameOrId: string): Promise<void> {
    await waitUntilTruthy(async () => {
        return !(await isContainerResponding(containerNameOrId));
    }, 'container was never removed');
}

export async function executeIfContainerIsNotRunning({
    containerNameOrId,
    enableLogging,
    callback,
}: {
    containerNameOrId: string;
    enableLogging: boolean;
    callback: (containerName: string) => Promise<void>;
}): Promise<void> {
    const containerInfo = await getContainerInfo(containerNameOrId);
    const containerIsAlreadyRunning: boolean = !!containerInfo?.State.Running;

    if (containerInfo && !containerInfo.State.Running) {
        // fully remove the container first
        await killContainer(containerNameOrId);
    }

    if (containerIsAlreadyRunning) {
        await waitForContainerToBeResponsive(containerNameOrId);
        logIf.faint(enableLogging, `Container "${containerNameOrId}" is already running...`);
    } else {
        return await callback(containerNameOrId);
    }
}
