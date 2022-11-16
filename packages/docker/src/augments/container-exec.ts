import {runShellCommand} from '@augment-vir/node-js';
import {combineCommandAndFlags, EnvMap, makeEnvFlags} from './docker-command-inputs';

export type ExecContainerInputs = {
    tty: boolean;
    containerNameOrId: string;
    command: string;
    envMapping?: EnvMap | undefined;
    executionEnv?: Record<string, string> | undefined;
    extraDockerInputs?: ReadonlyArray<string>;
};

export async function containerExec({
    tty,
    containerNameOrId,
    command,
    envMapping,
    executionEnv,
    extraDockerInputs = [],
}: ExecContainerInputs) {
    const envFlags = makeEnvFlags(envMapping);
    const ttyFlag = tty ? '-t' : '';

    const fullCommand = combineCommandAndFlags([
        'docker',
        'exec',
        ttyFlag,
        envFlags,
        ...extraDockerInputs,
        containerNameOrId,
        command,
    ]);

    return await runShellCommand(fullCommand, {
        env: executionEnv,
        rejectOnError: true,
    });
}
