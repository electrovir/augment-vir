import {check} from '@augment-vir/assert';
import {runShellCommand} from '../../augments/terminal/shell.js';
import {DockerEnvMap, makeEnvFlags} from './docker-command-inputs.js';

/**
 * Parameters for `docker.container.runCommand`.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type RunDockerContainerCommandParams = {
    /** Creates an interactive shell connection. */
    tty?: boolean | undefined;
    containerNameOrId: string;
    command: string;
    envMapping?: DockerEnvMap | undefined;
    executionEnv?: Record<string, string> | undefined;
    dockerFlags?: ReadonlyArray<string> | undefined;
};

export async function runContainerCommand({
    tty,
    containerNameOrId,
    command,
    envMapping,
    executionEnv,
    dockerFlags = [],
}: RunDockerContainerCommandParams) {
    const envFlags = makeEnvFlags(envMapping);
    /** Can't test tty in automated tests. */
    /* node:coverage ignore next 1 */
    const ttyFlag = tty ? '-it' : '';

    const fullCommand = [
        'docker',
        'exec',
        ttyFlag,
        envFlags,
        ...dockerFlags,
        containerNameOrId,
        command,
    ]
        .filter(check.isTruthy)
        .join(' ');

    return await runShellCommand(fullCommand, {
        env: executionEnv,
        rejectOnError: true,
    });
}
