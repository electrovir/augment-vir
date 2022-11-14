import {extractErrorMessage} from '@augment-vir/common';
import {logIf} from '@augment-vir/node-js';
import {killContainer} from './kill-container';

export async function tryOrKillContainer({
    containerName,
    enableLogging,
    callback,
}: {
    containerName: string;
    enableLogging: boolean;
    callback: (containerName: string) => Promise<void>;
}): Promise<void> {
    try {
        await callback(containerName);
    } catch (error) {
        logIf.error(
            enableLogging,
            `Execution on container "${containerName} failed": ${extractErrorMessage(error)}`,
        );
        await killContainer(containerName);
        throw error;
    }
}
