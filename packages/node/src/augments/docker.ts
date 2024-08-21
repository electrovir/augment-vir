import {getContainerInfo} from '../docker/containers/container-info.js';
import {
    getContainerLogs,
    getContainerStatus,
    waitUntilContainerExited,
    waitUntilContainerRemoved,
    waitUntilContainerRunning,
} from '../docker/containers/container-status.js';
import {copyToContainer} from '../docker/containers/copy-to-container.js';
import {
    makeEnvFlags,
    makePortMapFlags,
    makeVolumeFlags,
} from '../docker/containers/docker-command-inputs.js';
import {killContainer} from '../docker/containers/kill-container.js';
import {runContainerCommand} from '../docker/containers/run-command.js';
import {runContainer} from '../docker/containers/run-container.js';
import {tryOrKillContainer} from '../docker/containers/try-or-kill-container.js';
import {
    isImageInLocalRegistry,
    removeImageFromLocalRegistry,
    updateImage,
} from '../docker/docker-image.js';
import {isDockerRunning, startDocker} from '../docker/docker-startup.js';

export {
    DockerContainerStatusEnum,
    type DockerContainerInfo,
    type DockerContainerInfoState,
} from '../docker/containers/container-info.js';
export {
    DockerContainerStatus,
    exitedDockerContainerStatuses,
} from '../docker/containers/container-status.js';
export {type CopyToDockerContainerParams} from '../docker/containers/copy-to-container.js';
export {
    type DockerEnvMap,
    type DockerPortMap,
    type DockerVolumeMap,
    type DockerVolumeMappingType,
} from '../docker/containers/docker-command-inputs.js';
export {type RunDockerContainerCommandParams} from '../docker/containers/run-command.js';
export {type RunDockerContainerParams} from '../docker/containers/run-container.js';

/** Centralized Docker API from `@augment-vir/node`. */
export const docker = {
    isRunning: isDockerRunning,
    start: startDocker,
    image: {
        update: updateImage,
        remove: removeImageFromLocalRegistry,
        exists: isImageInLocalRegistry,
    },
    container: {
        getStatus: getContainerStatus,
        waitUntilRunning: waitUntilContainerRunning,
        waitUntilExited: waitUntilContainerExited,
        waitUntilRemoved: waitUntilContainerRemoved,
        tryOrKill: tryOrKillContainer,
        run: runContainer,
        kill: killContainer,
        copyTo: copyToContainer,
        runCommand: runContainerCommand,
        getInfo: getContainerInfo,
        getLogs: getContainerLogs,
    },
    util: {
        makeVolumeFlags,
        makePortMapFlags,
        makeEnvFlags,
    },
};
