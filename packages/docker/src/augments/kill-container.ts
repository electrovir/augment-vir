import {runShellCommand} from '@augment-vir/node-js';

export async function killContainer(
    containerNameOrId: string,
    keepContainer?: boolean,
): Promise<void> {
    const removeContainerCommand = keepContainer ? '' : `docker rm '${containerNameOrId}'`;

    await runShellCommand(`docker kill '${containerNameOrId}'; ${removeContainerCommand}`);
}
