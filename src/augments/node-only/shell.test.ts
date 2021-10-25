import {join} from 'path';
import {testGroup} from 'test-vir';
import {longRunningFile, longRunningFileWithStderr} from '../../repo-paths';
import {getRepoRootDir, interpolationSafeWindowsPath, toPosixPath} from './path';
import {runShellCommand} from './shell';

testGroup({
    description: runShellCommand.name,
    tests: (runTest) => {
        runTest({
            description: 'produces expected output',
            expect: {
                error: undefined,
                stderr: '',
                stdout: 'hello there\n',
                exitCode: 0,
                exitSignal: undefined,
            },
            test: async () => {
                return await runShellCommand('echo "hello there"');
            },
        });

        runTest({
            description: 'uses custom dir correctly',
            expect: {
                error: undefined,
                stderr: '',
                stdout: `${toPosixPath(__dirname)}\n`,
                exitCode: 0,
                exitSignal: undefined,
            },
            test: async () => {
                return await runShellCommand('pwd', {cwd: __dirname});
            },
        });

        runTest({
            description: 'grabs error',
            expectError: {
                errorClass: Error,
            },
            test: async () => {
                const result = await runShellCommand(`exit 1`);
                if (result.error) {
                    throw result.error;
                } else {
                }
            },
        });

        runTest({
            description: 'promise is rejected when requested to do so',
            expectError: {
                errorClass: Error,
            },
            test: async () => {
                await runShellCommand(`exit 2`, {rejectOnError: true});
            },
        });

        runTest({
            description: 'shell stdoutCallback should get fired when stdout is written',
            expect: [true, 'started\nended\n'],
            test: async () => {
                const output: string[] = [];
                let counter = 0;
                const interval = setInterval(() => {
                    output.push(String(counter++));
                }, 100);
                const finalResults = await runShellCommand(
                    `node ${interpolationSafeWindowsPath(longRunningFile)}`,
                    {
                        stdoutCallback: (stdout) => {
                            output.push(stdout.toString().trim());
                        },
                    },
                );
                clearInterval(interval);

                const startIndex = output.indexOf('started');
                const endIndex = output.indexOf('ended');

                return [endIndex - startIndex > 5, finalResults.stdout];
            },
        });

        runTest({
            description: 'shell stderrCallback should get fired when stderr is written',
            expect: [true, 'started\nended\n'],
            test: async () => {
                const output: string[] = [];
                let counter = 0;
                const interval = setInterval(() => {
                    output.push(String(counter++));
                }, 100);
                const finalResults = await runShellCommand(
                    `node ${interpolationSafeWindowsPath(longRunningFileWithStderr)}`,
                    {
                        stderrCallback: (stdout) => {
                            output.push(stdout.toString().trim());
                        },
                    },
                );
                clearInterval(interval);

                const startIndex = output.indexOf('started');
                const endIndex = output.indexOf('ended');

                return [endIndex - startIndex > 5, finalResults.stderr];
            },
        });

        runTest({
            description: 'no buffer overflow errors',
            expect: undefined,
            test: async () => {
                const packageLockPath = interpolationSafeWindowsPath(
                    join(getRepoRootDir(), 'package-lock.json'),
                );

                const finalPhrase = 'end of line';

                const commandOutput = await runShellCommand(
                    `seq 20 | xargs -I{} cat ${packageLockPath}; echo "${finalPhrase}"`,
                );

                if (!commandOutput.stdout.trim().endsWith(finalPhrase)) {
                    console.error(commandOutput.stdout);
                    throw new Error(`didn't read all data`);
                }

                return commandOutput.error;
            },
        });
    },
});
