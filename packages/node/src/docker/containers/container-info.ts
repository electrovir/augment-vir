import {runShellCommand} from '../../augments/terminal/shell.js';

/** There may be other possible values for Status. */
export enum DockerContainerStatusEnum {
    exited = 'exited',
    running = 'running',
}

export type DockerContainerInfoState = {
    Status: DockerContainerStatusEnum;
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
export type DockerContainerInfo = Readonly<{
    Id: string;
    Created: string;
    Path: string;
    Args: ReadonlyArray<string>;
    State: DockerContainerInfoState;
    Name: string;
}>;

export async function getContainerInfo(
    containerNameOrId: string,
): Promise<DockerContainerInfo | undefined> {
    const command = `docker inspect '${containerNameOrId}'`;
    const output = await runShellCommand(command);

    if (output.stderr.includes('Error: No such object')) {
        return undefined;
    }

    const parsedOutput = JSON.parse(output.stdout) as ReadonlyArray<DockerContainerInfo>;

    /** Edge cases that I don't know how to intentionally trigger. */
    /* node:coverage ignore next 5 */
    if (parsedOutput.length === 0) {
        throw new Error(`Got no output from "${command}"`);
    } else if (parsedOutput.length > 1) {
        throw new Error(`Got more than one output from "${command}"`);
    }

    return parsedOutput[0];
}
