import {join} from 'path';
// this path looks like an error but the symlink test will fix that
import {longRunningFile, longRunningFileWithStderr} from '../../repo-file-paths';
import {getRepoRootDir, interpolationSafeWindowsPath, toPosixPath} from './path';
import {runShellCommand} from './shell';

describe(runShellCommand.name, () => {
    it('produces expected output', async () => {
        expect(await runShellCommand('echo "hello there"')).toEqual({
            error: undefined,
            stderr: '',
            stdout: 'hello there\n',
            exitCode: 0,
            exitSignal: undefined,
        });
    });

    it('uses custom dir correctly', async () => {
        expect(await runShellCommand('pwd', {cwd: __dirname})).toEqual({
            error: undefined,
            stderr: '',
            stdout: `${toPosixPath(__dirname)}\n`,
            exitCode: 0,
            exitSignal: undefined,
        });
    });

    it('grabs error', async () => {
        expect((await runShellCommand(`exit 1`)).error).toBeInstanceOf(Error);
    });

    it('promise is rejected when requested to do so', async () => {
        await expect(runShellCommand(`exit 2`, {rejectOnError: true})).rejects.toThrow(Error);
    });

    it('shell stdoutCallback should get fired when stdout is written', async () => {
        const output: string[] = [];
        let counter = 0;
        const interval = setInterval(() => {
            output.push(String(counter++));
        }, 100);
        const finalResults = await runShellCommand(
            `ts-node ${interpolationSafeWindowsPath(longRunningFile)}`,
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

        expect(endIndex - startIndex).toBeGreaterThan(5);
        expect(finalResults.stdout).toBe('started\nended\n');
    });

    it('shell stderrCallback should get fired when stderr is written', async () => {
        const output: string[] = [];
        let counter = 0;
        const interval = setInterval(() => {
            output.push(String(counter++));
        }, 100);
        const finalResults = await runShellCommand(
            `ts-node ${interpolationSafeWindowsPath(longRunningFileWithStderr)}`,
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

        expect(endIndex - startIndex).toBeGreaterThan(5);
        expect(finalResults.stderr).toBe('started\nended\n');
    });

    it('no buffer overflow errors', async () => {
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

        expect(commandOutput.error).toBeUndefined();
    });
});
