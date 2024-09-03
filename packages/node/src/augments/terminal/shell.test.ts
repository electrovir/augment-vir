import {assert} from '@augment-vir/assert';
import {createLoggerWithStoredLogs} from '@augment-vir/common';
import {PartialWithUndefined} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {
    longRunningFilePath,
    longRunningFileWithStderr,
    nodePackageDir,
} from '../file-paths.mock.js';
import {interpolationSafeWindowsPath, toPosixPath} from './path/os-path.js';
import {logShellOutput, LogShellOutputOptions, runShellCommand, type ShellOutput} from './shell.js';

describe(runShellCommand.name, () => {
    it('produces expected output', async () => {
        assert.deepEquals(await runShellCommand('echo "hello there"'), {
            error: undefined,
            stderr: '',
            stdout: 'hello there\n',
            exitCode: 0,
            exitSignal: undefined,
        });
    });
    it('hooks up to the console', async () => {
        assert.deepEquals(
            await runShellCommand('echo "out"; >&2 echo "err"', {
                hookUpToConsole: true,
            }),
            {
                error: undefined,
                stderr: 'err\n',
                stdout: 'out\n',
                exitCode: 0,
                exitSignal: undefined,
            },
        );
    });

    it('uses custom dir correctly', async () => {
        assert.deepEquals(await runShellCommand('pwd', {cwd: import.meta.dirname}), {
            error: undefined,
            stderr: '',
            stdout: `${toPosixPath(import.meta.dirname)}\n`,
            exitCode: 0,
            exitSignal: undefined,
        });
    });

    it('grabs error', async () => {
        assert.isError((await runShellCommand(`exit 1`)).error);
    });

    it('promise is rejected when requested to do so', async () => {
        await assert.throws(runShellCommand(`exit 2`, {rejectOnError: true}), {
            matchConstructor: Error,
        });
    });

    it('shell stdoutCallback should get fired when stdout is written', async () => {
        const output: string[] = [];
        let counter = 0;
        const interval = setInterval(() => {
            output.push(String(counter++));
        }, 100);
        const finalResults = await runShellCommand(
            `tsx ${interpolationSafeWindowsPath(longRunningFilePath)}`,
            {
                rejectOnError: true,
                stdoutCallback: (stdout) => {
                    output.push(stdout.toString().trim());
                },
            },
        );
        clearInterval(interval);

        const startIndex = output.indexOf('started');
        const endIndex = output.indexOf('ended');

        assert.isAbove(endIndex - startIndex, 5);
        assert.strictEquals(finalResults.stdout, 'started\nended\n');
    });

    it('shell stderrCallback should get fired when stderr is written', async () => {
        const output: string[] = [];
        let counter = 0;
        const interval = setInterval(() => {
            output.push(String(counter++));
        }, 100);
        const finalResults = await runShellCommand(
            `tsx ${interpolationSafeWindowsPath(longRunningFileWithStderr)}`,
            {
                rejectOnError: true,
                stderrCallback: (stdout) => {
                    output.push(stdout.toString().trim());
                },
            },
        );
        clearInterval(interval);

        const startIndex = output.indexOf('started');
        const endIndex = output.indexOf('ended');

        assert.isAbove(endIndex - startIndex, 5);
        assert.strictEquals(finalResults.stderr, 'started\nended\n');
    });

    it('no buffer overflow errors', async () => {
        const packageLockPath = interpolationSafeWindowsPath(
            join(nodePackageDir, 'package-lock.json'),
        );

        const finalPhrase = 'end of line';

        const commandOutput = await runShellCommand(
            `seq 20 | xargs -I{} cat ${packageLockPath}; echo "${finalPhrase}"`,
        );

        if (!commandOutput.stdout.trim().endsWith(finalPhrase)) {
            console.error(commandOutput.stdout);
            throw new Error(`didn't read all data`);
        }

        assert.isUndefined(commandOutput.error);
    });
});

describe(logShellOutput.name, () => {
    function testLogShellOutput(
        options: Omit<LogShellOutputOptions, 'logger'>,
        shellOutputOverride: PartialWithUndefined<Omit<ShellOutput, 'exitSignal'>> = {},
    ) {
        const {log, logs} = createLoggerWithStoredLogs({omitColors: true});

        logShellOutput(
            {
                // @ts-expect-error: passing a string instead of an `Error` to make the output easier to test
                error: 'fake error',
                exitCode: 1,
                stdout: 'hi out',
                stderr: 'hi err',
                ...shellOutputOverride,
            },
            {
                ...options,
                logger: log,
            },
        );
        return logs;
    }

    itCases(testLogShellOutput, [
        {
            it: 'logs everything',
            inputs: [
                {
                    withLabels: true,
                },
            ],
            expect: {
                stdout: [
                    'exit code',
                    '1',
                    'stdout',
                    'hi out',
                    'stderr',
                    'error',
                ],
                stderr: [
                    'hi err',
                    'fake error',
                ],
            },
        },
        {
            it: 'ignores error',
            inputs: [
                {
                    withLabels: true,
                    ignoreError: true,
                },
            ],
            expect: {
                stdout: [
                    'exit code',
                    '1',
                    'stdout',
                    'hi out',
                    'stderr',
                ],
                stderr: [
                    'hi err',
                ],
            },
        },
        {
            it: 'omits labels',
            inputs: [{}],
            expect: {
                stdout: [
                    '1',
                    'hi out',
                ],
                stderr: [
                    'hi err',
                    'fake error',
                ],
            },
        },
        {
            it: 'logs nothing when there is nothing to log',
            inputs: [
                {},
                {
                    error: undefined,
                    exitCode: undefined,
                    stderr: undefined,
                    stdout: undefined,
                },
            ],
            expect: {
                stdout: [],
                stderr: [],
            },
        },
    ]);
});
