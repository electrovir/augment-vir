import {runShellCommand} from '@augment-vir/node-js';

export type CopyToContainerInputs = {
    hostPath: string;
    isDir: boolean;
    containerAbsolutePath: string;
    containerNameOrId: string;
    extraDockerInputs?: ReadonlyArray<string>;
};

export async function copyToContainer({
    containerAbsolutePath,
    isDir,
    hostPath,
    containerNameOrId,
    extraDockerInputs = [],
}: CopyToContainerInputs): Promise<void> {
    const suffix = isDir ? '/.' : '';
    const fullHostPath = `${hostPath}${suffix}`;
    const extraInputs: string = extraDockerInputs.join(' ');

    await runShellCommand(
        `docker cp ${extraInputs} '${fullHostPath}' '${containerNameOrId}:${containerAbsolutePath}'`,
        {rejectOnError: true},
    );
}
