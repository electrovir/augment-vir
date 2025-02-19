import {wrapString} from '@augment-vir/common';
import {ensureError} from '@augment-vir/core';
import {runShellCommand} from '../augments/terminal/shell.js';

export async function updateImage(
    /** @example 'alpine:3.20.2' */
    imageName: string,
    platform?: string,
) {
    if (await isImageInLocalRegistry(imageName)) {
        /** If image already exists then we don't need to update it. */
        return;
    }

    const command = [
        'docker',
        'pull',
        ...(platform
            ? [
                  '--platform',
                  platform,
              ]
            : []),
        wrapString({value: imageName, wrapper: "'"}),
    ].join(' ');

    await runShellCommand(command, {
        rejectOnError: true,
    });
}

export async function isImageInLocalRegistry(
    /** @example 'alpine:3.20.2' */
    imageName: string,
): Promise<boolean> {
    const output = await runShellCommand(`docker inspect '${imageName}'`);

    return output.exitCode === 0;
}

export async function removeImageFromLocalRegistry(
    /** @example 'alpine:3.20.2' */
    imageName: string,
) {
    try {
        await runShellCommand(`docker image rm '${imageName}'`, {
            rejectOnError: true,
        });
    } catch (caught) {
        const error = ensureError(caught);

        if (error.message.includes('No such image:')) {
            /** Ignore the case where the image has already been deleted. */
            return;
        }

        /** An edge case that I don't know how to intentionally trigger. */
        /* node:coverage ignore next 2 */
        throw error;
    }
}
