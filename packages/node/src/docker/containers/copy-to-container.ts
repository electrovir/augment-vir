import {addSuffix} from '@augment-vir/common';
import {stat} from 'node:fs/promises';
import {runShellCommand} from '../../augments/terminal/shell.js';

export type CopyToDockerContainerParams = {
    hostPath: string;
    containerAbsolutePath: string;
    containerNameOrId: string;
    dockerFlags?: ReadonlyArray<string>;
};

export async function copyToContainer({
    containerAbsolutePath,
    hostPath,
    containerNameOrId,
    dockerFlags = [],
}: CopyToDockerContainerParams): Promise<void> {
    const isDir = (await stat(hostPath)).isDirectory();
    const suffix = isDir ? '/.' : '';
    const fullHostPath = addSuffix({value: hostPath, suffix});
    const extraInputs: string = dockerFlags.join(' ');

    await runShellCommand(
        `docker cp ${extraInputs} '${fullHostPath}' '${containerNameOrId}:${containerAbsolutePath}'`,
        {rejectOnError: true},
    );
}
