import type {PartialWithUndefined} from '@augment-vir/core';
import {runShellCommand} from '../../augments/terminal/shell.js';
import {waitUntilContainerExited, waitUntilContainerRemoved} from './container-status.js';

export async function killContainer(
    containerNameOrId: string,
    options: PartialWithUndefined<{
        /**
         * If set to `true`, the container will be killed but won't be removed. (You'll still see it
         * in your Docker Dashboard but it'll have a status of exited.)
         *
         * @default false
         */
        keepContainer: boolean;
    }> = {},
): Promise<void> {
    await runShellCommand(`docker kill '${containerNameOrId}'`);

    if (options.keepContainer) {
        await waitUntilContainerExited(containerNameOrId);
    } else {
        await runShellCommand(`docker rm '${containerNameOrId}'`);
        await waitUntilContainerRemoved(containerNameOrId);
    }
}
