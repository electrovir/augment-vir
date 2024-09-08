import {combineErrors, log, type Logger} from '@augment-vir/common';
import type {MaybePromise, PartialWithUndefined, RequiredAndNotNull} from '@augment-vir/core';
import {ChildProcess, ExecException, spawn} from 'node:child_process';
import {defineTypedCustomEvent, ListenTarget} from 'typed-event-target';

/**
 * All output from {@link runShellCommand}.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type ShellOutput = {
    error: undefined | Error;
    stderr: string;
    stdout: string;
    exitCode: number | undefined;
    exitSignal: NodeJS.Signals | undefined;
};

/**
 * An event that indicates that the shell command just wrote to stdout.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export class ShellStdoutEvent extends defineTypedCustomEvent<string | Buffer>()('shell-stdout') {}
/**
 * An event that indicates that the shell command just wrote to stderr.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export class ShellStderrEvent extends defineTypedCustomEvent<string | Buffer>()('shell-stderr') {}
/**
 * An event that indicates that the shell command is finished. This contains an exit code or an exit
 * signal. Based on the Node.js documentation, either one or the other is defined, never both at the
 * same time.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export class ShellDoneEvent extends defineTypedCustomEvent<{
    exitCode: number | undefined;
    exitSignal: NodeJS.Signals | undefined;
}>()('shell-done') {}
/**
 * An event that indicates that the shell command errored.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export class ShellErrorEvent extends defineTypedCustomEvent<Error>()('shell-error') {}

/**
 * A shell command listen target that emits events.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export class ShellTarget extends ListenTarget<
    ShellStdoutEvent | ShellStderrEvent | ShellDoneEvent | ShellErrorEvent
> {
    constructor(public readonly childProcess: ChildProcess) {
        super();
    }
}

/**
 * Runs a shell command and returns a {@link ShellTarget} instance for directly hooking into shell
 * events. This allows instant reactions to shell events but in a less convenient API compared to
 * {@link runShellCommand}.
 *
 * @category Node : Terminal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 * @see
 * - {@link runShellCommand}: a higher level and more succinct way of running a shell command.
 */
export function streamShellCommand(
    command: string,
    cwd?: string,
    shell = 'bash',
    env: NodeJS.ProcessEnv = process.env,
    hookUpToConsole = false,
): ShellTarget {
    const stdio = hookUpToConsole ? [process.stdin] : undefined;

    const childProcess = spawn(command, {shell, cwd, env, stdio});
    const shellTarget = new ShellTarget(childProcess);

    /** Type guards. */
    /* node:coverage ignore next 5 */
    if (!childProcess.stdout) {
        throw new Error(`stdout emitter was not created by exec for some reason.`);
    } else if (!childProcess.stderr) {
        throw new Error(`stderr emitter was not created by exec for some reason.`);
    }

    childProcess.stdout.on('data', (chunk) => {
        shellTarget.dispatch(new ShellStdoutEvent({detail: chunk}));
    });
    childProcess.stderr.on('data', (chunk) => {
        shellTarget.dispatch(new ShellStderrEvent({detail: chunk}));
    });

    /** Idk how to trigger the 'error' event. */
    /* node:coverage ignore next 3 */
    childProcess.on('error', (error) => {
        shellTarget.dispatch(new ShellErrorEvent({detail: error}));
    });
    /**
     * Based on the Node.js documentation, we should listen to "close" instead of "exit" because the
     * io streams will be finished when "close" emits. Also "close" always emits after "exit"
     * anyway.
     */
    childProcess.on('close', (inputExitCode, inputExitSignal) => {
        /** Idk how to control exitCode or exitSignal being null or not-null. */
        /* node:coverage ignore next 2 */
        const exitCode: number | undefined = inputExitCode ?? undefined;
        const exitSignal: NodeJS.Signals | undefined = inputExitSignal ?? undefined;

        if ((exitCode !== undefined && exitCode !== 0) || exitSignal !== undefined) {
            const execException: ExecException & {cwd?: string | undefined} = new Error(
                `Command failed: ${command}`,
            );
            execException.code = exitCode;
            execException.signal = exitSignal;
            execException.cmd = command;
            execException.killed = childProcess.killed;
            execException.cwd = cwd;
            shellTarget.dispatch(new ShellErrorEvent({detail: execException}));
        }
        shellTarget.dispatch(
            new ShellDoneEvent({
                detail: {
                    exitCode,
                    exitSignal,
                },
            }),
        );
    });

    return shellTarget;
}

/**
 * Options for {@link runShellCommand}.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type RunShellCommandOptions = {
    cwd?: string | undefined;
    env?: NodeJS.ProcessEnv | undefined;
    shell?: string | undefined;
    /** Automatically hook up stdout and stderr printing to the caller's console methods. */
    hookUpToConsole?: boolean | undefined;
    rejectOnError?: boolean | undefined;
    /** Callback to call whenever the shell logs to stdout. */
    stdoutCallback?: (stdout: string, childProcess: ChildProcess) => MaybePromise<void> | undefined;
    /** Callback to call whenever the shell logs to stderr. */
    stderrCallback?: (stderr: string, childProcess: ChildProcess) => MaybePromise<void> | undefined;
};

function prepareChunkForLogging(chunk: string | Buffer, trimEndingLine: boolean): string {
    const stringified = chunk.toString();

    return trimEndingLine ? stringified.replace(/\n$/, '') : stringified;
}

/**
 * Runs a shell command and returns its output.
 *
 * @category Node : Terminal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 * @see
 * - {@link streamShellCommand}: a lower level way of running a shell command that allows instant reactions to shell events.
 */
export async function runShellCommand(
    command: string,
    options: RunShellCommandOptions = {},
): Promise<ShellOutput> {
    return new Promise<ShellOutput>((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const errors: Error[] = [];

        const shellTarget = streamShellCommand(
            command,
            options.cwd,
            options.shell,
            options.env,
            options.hookUpToConsole,
        );

        shellTarget.listen(ShellStdoutEvent, ({detail: chunk}) => {
            if (options.stdoutCallback) {
                void options.stdoutCallback(
                    prepareChunkForLogging(chunk, false),
                    shellTarget.childProcess,
                );
            }
            if (options.hookUpToConsole) {
                process.stdout.write(prepareChunkForLogging(chunk, true) + '\n');
            }
            stdout += String(chunk);
        });
        shellTarget.listen(ShellStderrEvent, ({detail: chunk}) => {
            if (options.stderrCallback) {
                void options.stderrCallback(
                    prepareChunkForLogging(chunk, false),
                    shellTarget.childProcess,
                );
            }
            if (options.hookUpToConsole) {
                process.stderr.write(prepareChunkForLogging(chunk, true) + '\n');
            }
            stderr += String(chunk);
        });
        shellTarget.listen(ShellErrorEvent, ({detail: error}) => {
            errors.push(error);
            if (!options.rejectOnError) {
                return;
            }

            /** Covering edge cases. */
            /* node:coverage disable */
            if (shellTarget.childProcess.connected) {
                shellTarget.childProcess.disconnect();
            }
            if (
                shellTarget.childProcess.exitCode == null &&
                shellTarget.childProcess.signalCode == null &&
                !shellTarget.childProcess.killed
            ) {
                shellTarget.childProcess.kill();
            }
            /* node:coverage enable */

            shellTarget.destroy();

            const rejectionErrorMessage: Error = combineErrors([
                new Error(stderr),
                ...errors,
            ]);
            /** Reject now because the "done" listener won't get fired after killing the process. */
            reject(rejectionErrorMessage);
        });
        shellTarget.listen(ShellDoneEvent, ({detail: {exitCode, exitSignal}}) => {
            shellTarget.destroy();
            resolve({
                error: errors.length ? combineErrors(errors) : undefined,
                stdout,
                stderr,
                exitCode,
                exitSignal,
            });
        });
    });
}

/**
 * Options for {@link logShellOutput}.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type LogShellOutputOptions = PartialWithUndefined<{
    logger: Logger;
    withLabels: boolean;
    ignoreError: boolean;
}>;

const defaultLogShellOutputOptions: RequiredAndNotNull<LogShellOutputOptions> = {
    ignoreError: false,
    logger: log,
    withLabels: false,
};

/**
 * Log the output of running a shell command. This is useful for quick debugging of shell commands.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function logShellOutput(
    shellOutput: PartialWithUndefined<Omit<ShellOutput, 'exitSignal'>>,
    {
        ignoreError = defaultLogShellOutputOptions.ignoreError,
        logger = defaultLogShellOutputOptions.logger,
        withLabels = defaultLogShellOutputOptions.withLabels,
    }: LogShellOutputOptions = defaultLogShellOutputOptions,
) {
    logger.if(withLabels).info('exit code');
    logger.if(shellOutput.exitCode != undefined || withLabels).plain(shellOutput.exitCode || 0);

    logger.if(withLabels).info('stdout');
    logger.if(!!shellOutput.stdout || withLabels).plain(shellOutput.stdout || '');

    logger.if(withLabels).info('stderr');
    logger.if(!!shellOutput.stderr || withLabels).error(shellOutput.stderr || '');

    logger.if(withLabels && !ignoreError).info('error');
    logger.if((!!shellOutput.error || withLabels) && !ignoreError).error(shellOutput.error);
}
