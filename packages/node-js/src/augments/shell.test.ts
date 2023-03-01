import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {describe, it} from 'mocha';
import {join} from 'path';
import {
    longRunningFile,
    longRunningFileWithStderr,
    nodeJsPackageDir,
} from '../repo-file-paths.test-helpers';
import {interpolationSafeWindowsPath, toPosixPath} from './path';
import {runShellCommand} from './shell';

describe(runShellCommand.name, () => {
    it('produces expected output', async () => {
        expect(await runShellCommand('echo "hello there"')).to.deep.equal({
            error: undefined,
            stderr: '',
            stdout: 'hello there\n',
            exitCode: 0,
            exitSignal: undefined,
        });
    });

    it('uses custom dir correctly', async () => {
        expect(await runShellCommand('pwd', {cwd: __dirname})).to.deep.equal({
            error: undefined,
            stderr: '',
            stdout: `${toPosixPath(__dirname)}\n`,
            exitCode: 0,
            exitSignal: undefined,
        });
    });

    it('grabs error', async () => {
        expect((await runShellCommand(`exit 1`)).error).to.be.instanceOf(Error);
    });

    it('promise is rejected when requested to do so', async () => {
        chai.use(chaiAsPromised);
        await expect(runShellCommand(`exit 2`, {rejectOnError: true})).to.be.rejectedWith(Error);
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

        expect(endIndex - startIndex).to.be.greaterThan(5);
        expect(finalResults.stdout).to.equal('started\nended\n');
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

        expect(endIndex - startIndex).to.be.greaterThan(5);
        expect(finalResults.stderr).to.equal('started\nended\n');
    });

    it('no buffer overflow errors', async () => {
        const packageLockPath = interpolationSafeWindowsPath(
            join(nodeJsPackageDir, 'package-lock.json'),
        );

        const finalPhrase = 'end of line';

        const commandOutput = await runShellCommand(
            `seq 20 | xargs -I{} cat ${packageLockPath}; echo "${finalPhrase}"`,
        );

        if (!commandOutput.stdout.trim().endsWith(finalPhrase)) {
            console.error(commandOutput.stdout);
            throw new Error(`didn't read all data`);
        }

        expect(commandOutput.error).to.equal(undefined);
    });
});
