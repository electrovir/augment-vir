import {runShellCommand} from '@augment-vir/node-js';

export type CopyToContainerInputs = {
    hostPath: string;
    isDir: boolean;
    containerAbsolutePath: string;
    containerNameOrId: string;
};

export async function copyToContainer({
    containerAbsolutePath,
    isDir,
    hostPath,
    containerNameOrId,
}: CopyToContainerInputs): Promise<void> {
    const suffix = isDir ? '/.' : '';
    const fullHostPath = `${hostPath}${suffix}`;
    await runShellCommand(
        `docker cp '${fullHostPath}' '${containerNameOrId}:${containerAbsolutePath}'`,
        {rejectOnError: true},
    );
}
