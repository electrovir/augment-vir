import {runShellCommand} from '@augment-vir/node-js';

/** There may be other possible values for Status. */
export enum ContainerStatusEnum {
    exited = 'exited',
    running = 'running',
}

export type ContainerInfoState = {
    Status: ContainerStatusEnum;
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: boolean;
    Dead: boolean;
    Pid: number;
    ExitCode: number;
    Error: string;
    StartedAt: string;
    FinishedAt: string;
};

/** This type signature is incomplete. Add to it as necessary. */
export type ContainerInfo = Readonly<{
    Id: string;
    Created: string;
    Path: string;
    Args: ReadonlyArray<string>;
    State: ContainerInfoState;
    Name: string;
}>;

export async function getContainerInfo(
    containerNameOrId: string,
): Promise<ContainerInfo | undefined> {
    const command = `docker inspect '${containerNameOrId}'`;
    const output = await runShellCommand(command);

    if (output.stderr.includes('Error: No such object')) {
        return undefined;
    }

    const parsedOutput = JSON.parse(output.stdout) as ReadonlyArray<ContainerInfo>;

    if (parsedOutput.length === 0) {
        throw new Error(`Got no output from "${command}"`);
    } else if (parsedOutput.length > 1) {
        throw new Error(`Got more than one output from "${command}"`);
    }

    return parsedOutput[0];
}
