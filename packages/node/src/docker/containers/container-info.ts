import type {JsonCompatibleArray, JsonCompatibleObject} from '@augment-vir/common';
import {runShellCommand} from '../../augments/terminal/shell.js';
import type {DockerContainerStatus} from './container-status.js';

/**
 * Properties on {@link DockerContainerInfo}.State, retrieved from {@link getContainerInfo}.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export type DockerContainerInfoState = {
    Status: DockerContainerStatus;
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

/**
 * Properties on the output from {@link getContainerInfo}. Not all these properties are filled in all
 * the way, particularly most of properties with nested objects.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export type DockerContainerInfo = Readonly<{
    Id: string;
    Created: string;
    Path: string;
    Args: ReadonlyArray<string>;
    State: DockerContainerInfoState;
    Image: string;
    ResolvConfPath: string;
    HostnamePath: string;
    HostsPath: string;
    LogPath: string;
    Name: string;
    RestartCount: number;
    Driver: string;
    Platform: string;
    MountLabel: string;
    ProcessLabel: string;
    AppArmorProfile: string;
    ExecIDs: unknown;
    HostConfig: JsonCompatibleObject;
    GraphDriver: JsonCompatibleObject;
    Mounts: JsonCompatibleArray;
    Config: JsonCompatibleObject;
    NetworkSettings: JsonCompatibleObject;
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
