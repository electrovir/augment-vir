import {combineErrorMessages, combineErrors} from '@augment-vir/common';
import {ChildProcess, ExecException, spawn} from 'child_process';
import {EventEmitter} from 'stream';

export type ShellOutput = {
    error: undefined | Error;
    stderr: string;
    stdout: string;
    exitCode: number | undefined;
    exitSignal: NodeJS.Signals | undefined;
};

export const ShellEmitterEvent = {
    stdout: 'stdout',
    stderr: 'stderr',
    done: 'done',
    error: 'error',
} as const;
export type ShellEmitterEventKey = (typeof ShellEmitterEvent)[keyof typeof ShellEmitterEvent];

export type ShellEmitterListenerMap = {
    [ShellEmitterEvent.stdout]: [string | Buffer];
    [ShellEmitterEvent.stderr]: [string | Buffer];
    /**
     * Exit code and exit signal. Based on the Node.js documentation, either one or the other is
     * defined, never both at the same time.
     */
    [ShellEmitterEvent.done]: [
        exitCode: number | undefined,
        exitSignal: NodeJS.Signals | undefined,
    ];
    [ShellEmitterEvent.error]: [Error];
};

export interface ShellEmitter extends EventEmitter {
    emit<T extends ShellEmitterEventKey>(type: T, ...args: ShellEmitterListenerMap[T]): boolean;
    on<T extends ShellEmitterEventKey>(
        type: T,
        listener: (...args: ShellEmitterListenerMap[T]) => void,
    ): this;
    addListener<T extends ShellEmitterEventKey>(
        type: T,
        listener: (...args: ShellEmitterListenerMap[T]) => void,
    ): this;
    once<T extends ShellEmitterEventKey>(
        type: T,
        listener: (...args: ShellEmitterListenerMap[T]) => void,
    ): this;
    removeListener<T extends ShellEmitterEventKey>(
        type: T,
        listener: (...args: ShellEmitterListenerMap[T]) => void,
    ): this;
    off<T extends ShellEmitterEventKey>(
        type: T,
        listener: (...args: ShellEmitterListenerMap[T]) => void,
    ): this;

    childProcess: ChildProcess;
}

export function streamShellCommand(
    command: string,
    cwd?: string,
    shell = 'bash',
    env: NodeJS.ProcessEnv = process.env,
    hookUpToConsole = false,
): ShellEmitter {
    const shellEmitter: ShellEmitter = new EventEmitter() as ShellEmitter;

    const stdio = hookUpToConsole ? [process.stdin] : undefined;

    const childProcess = spawn(command, {shell, cwd, env, stdio});
    shellEmitter.childProcess = childProcess;

    if (!childProcess.stdout) {
        throw new Error(`stdout emitter was not created by exec for some reason.`);
    }
    if (!childProcess.stderr) {
        throw new Error(`stderr emitter was not created by exec for some reason.`);
    }

    childProcess.stdout.on('data', (chunk) => {
        shellEmitter.emit(ShellEmitterEvent.stdout, chunk);
    });
    childProcess.stderr.on('data', (chunk) => {
        shellEmitter.emit(ShellEmitterEvent.stderr, chunk);
    });

    childProcess.on('error', (processError) => {
        shellEmitter.emit(ShellEmitterEvent.error, processError);
    });
    /**
     * Based on the Node.js documentation, we should listen to "close" instead of "exit" because the
     * io streams will be finished when "close" emits. Also "close" always emits after "exit"
     * anyway.
     */
    childProcess.on('close', (inputExitCode, inputExitSignal) => {
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
            shellEmitter.emit(ShellEmitterEvent.error, execException);
        }
        shellEmitter.emit(ShellEmitterEvent.done, exitCode, exitSignal);
    });
    // Might need to add a "disconnect" listener here as well. I'm not sure what it should do yet.
    // Like, should it emit "done"? idk.

    return shellEmitter;
}

type ShellListener<T extends ShellEmitterEventKey = ShellEmitterEventKey> = {
    eventType: T;
    eventListener: (...args: ShellEmitterListenerMap[T]) => void;
};
/** Helper function just to help with generics. */
function processListener<T extends ShellEmitterEventKey>(
    eventType: ShellListener<T>['eventType'],
    eventListener: ShellListener<T>['eventListener'],
): ShellListener<T> {
    return {eventType, eventListener};
}

export type RunShellCommandParams = {
    cwd?: string | undefined;
    env?: NodeJS.ProcessEnv | undefined;
    shell?: string | undefined;
    /** Automatically hook up stdout and stderr printing to the caller's console methods. */
    hookUpToConsole?: boolean | undefined;
    rejectOnError?: boolean | undefined;
    stdoutCallback?: (stdout: string) => void | Promise<void> | undefined;
    stderrCallback?: (stderr: string) => void | Promise<void> | undefined;
};

function prepareChunkForLogging(chunk: string | Buffer, trimEndingLine: boolean): string {
    const stringified = chunk.toString();

    return trimEndingLine ? stringified.replace(/\n$/, '') : stringified;
}

export async function runShellCommand(
    command: string,
    options: RunShellCommandParams = {},
): Promise<ShellOutput> {
    return new Promise<ShellOutput>((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const errors: Error[] = [];

        const shellStream = streamShellCommand(
            command,
            options.cwd,
            options.shell,
            options.env,
            options.hookUpToConsole,
        );

        const listeners: ReadonlyArray<Readonly<ShellListener>> = [
            processListener(ShellEmitterEvent.stdout, (chunk) => {
                if (options.stdoutCallback) {
                    options.stdoutCallback(prepareChunkForLogging(chunk, false));
                }
                if (options.hookUpToConsole) {
                    console.log(prepareChunkForLogging(chunk, true));
                }
                stdout += chunk;
            }),
            processListener(ShellEmitterEvent.stderr, (chunk) => {
                if (options.stderrCallback) {
                    options.stderrCallback(prepareChunkForLogging(chunk, false));
                }
                if (options.hookUpToConsole) {
                    console.error(prepareChunkForLogging(chunk, true));
                }
                stderr += chunk;
            }),
            processListener(ShellEmitterEvent.error, (executionError) => {
                errors.push(executionError);
                if (options.rejectOnError) {
                    listeners.forEach((listener) =>
                        shellStream.removeListener(listener.eventType, listener.eventListener),
                    );

                    if (shellStream.childProcess.connected) {
                        shellStream.childProcess.disconnect();
                    }
                    if (
                        shellStream.childProcess.exitCode == null &&
                        shellStream.childProcess.signalCode == null &&
                        !shellStream.childProcess.killed
                    ) {
                        shellStream.childProcess.kill();
                    }
                    const rejectionErrorMessage: string = combineErrorMessages([
                        ...errors,
                        stderr,
                    ]);

                    // reject now cause the "done" listener won't get fired after killing the process
                    reject(new Error(rejectionErrorMessage));
                }
            }),
            processListener(ShellEmitterEvent.done, (exitCode, exitSignal) => {
                resolve({
                    error: combineErrors(errors),
                    stdout,
                    stderr,
                    exitCode,
                    exitSignal,
                });
            }),
        ] as ReadonlyArray<Readonly<ShellListener>>;

        listeners.forEach((listener) => {
            shellStream.addListener(listener.eventType, listener.eventListener);
        });
    });
}

export function printShellCommandOutput(
    ShellOutput: {error?: unknown; stderr?: unknown; stdout?: unknown; exitCode?: unknown},
    withLabels = false,
    ignoreError = false,
) {
    if (ShellOutput.exitCode != undefined || withLabels) {
        withLabels && console.info('exit code');
        console.info(ShellOutput.exitCode);
    }
    if (!!ShellOutput.stdout || withLabels) {
        withLabels && console.info('stdout');
        console.info(ShellOutput.stdout);
    }
    if (!!ShellOutput.stderr || withLabels) {
        withLabels && console.info('stderr');
        console.error(ShellOutput.stderr);
    }
    if (ShellOutput.error || withLabels) {
        withLabels && console.info('error');
        if (!ignoreError) {
            throw ShellOutput.error;
        }
    }
}
