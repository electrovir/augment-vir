import {waitUntil} from '@augment-vir/assert';
import {currentOperatingSystem, OperatingSystem} from '../augments/os/operating-system.js';
import {runShellCommand} from '../augments/shell.js';

export async function isDockerRunning() {
    const output = await runShellCommand('docker info');

    return output.exitCode === 0;
}

const startDockerCommands: Record<OperatingSystem, string> = {
    /**
     * Officially supported for the following distros:
     *
     * - [Ubuntu](https://docs.docker.com/desktop/install/ubuntu/#launch-docker-desktop)
     * - [Debian](https://docs.docker.com/desktop/install/debian/#launch-docker-desktop)
     * - [Fedora](https://docs.docker.com/desktop/install/fedora/#launch-docker-desktop)
     * - [Arch](https://docs.docker.com/desktop/install/archlinux/#launch-docker-desktop)
     */
    [OperatingSystem.Linux]: 'systemctl --user start docker-desktop',
    [OperatingSystem.Mac]: 'open -a Docker',
    [OperatingSystem.Windows]: String.raw`/c/Program\ Files/Docker/Docker/Docker\ Desktop.exe`,
};

export async function startDocker() {
    const command = startDockerCommands[currentOperatingSystem];

    /** We */
    /* node:coverage disable */
    if (await isDockerRunning()) {
        /** Docker is already running. Nothing to do. */
        return;
    }

    await waitUntil.isTrue(
        async () => {
            await runShellCommand(command, {rejectOnError: true});
            return isDockerRunning();
        },
        {
            interval: {
                seconds: 1,
            },
            timeout: {
                minutes: 1,
            },
        },
        'Failed to start Docker.',
    );
}
