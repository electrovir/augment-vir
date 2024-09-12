import type {MaybePromise} from '@augment-vir/core';
import {killContainer} from './kill-container.js';

/**
 * Runs a callback (which presumably runs a command within the given `containerName`) and kills the
 * given `containerName` container if the callback fails.
 */
export async function tryOrKillContainer<T>(
    containerNameOrId: string,
    callback: (containerNameOrId: string) => MaybePromise<T>,
): Promise<Awaited<T>> {
    try {
        return await callback(containerNameOrId);
    } catch (error) {
        await killContainer(containerNameOrId);
        throw error;
    }
}
