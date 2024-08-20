import {ensureError} from '@augment-vir/core';
import {runShellCommand} from '../augments/shell.js';

export async function updateImage(
    /**
     * @example
     *     'alpine:3.20.2';
     */
    imageName: string,
) {
    if (await isImageInLocalRegistry(imageName)) {
        /** If image already exists then we don't need to update it. */
        return;
    }

    await runShellCommand(`docker pull '${imageName}'`, {
        rejectOnError: true,
    });
}

export async function isImageInLocalRegistry(
    /**
     * @example
     *     'alpine:3.20.2';
     */
    imageName: string,
): Promise<boolean> {
    const output = await runShellCommand(`docker inspect '${imageName}'`);

    return output.exitCode === 0;
}

export async function removeImageFromLocalRegistry(
    /**
     * @example
     *     'alpine:3.20.2';
     */
    imageName: string,
) {
    try {
        await runShellCommand(`docker image rm '${imageName}'`, {rejectOnError: true});
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
