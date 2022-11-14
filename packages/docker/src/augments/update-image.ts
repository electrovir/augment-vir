import {logIf, runShellCommand} from '@augment-vir/node-js';

export async function updateImage(imageName: string, enableLogging: boolean) {
    logIf.faint(enableLogging, `Updating image "${imageName}"...`);
    await runShellCommand(`docker pull '${imageName}'`, {
        rejectOnError: true,
    });
}
