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

/**
 * Centralized Docker API from `@augment-vir/node`.
 *
 * @category Node : Docker
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export const docker = {
    /** Detects if the Docker service is running. */
    isRunning: isDockerRunning,
    /**
     * Tries to start Docker based ont he current operating system's supported commands. The success
     * of this operation is heavily dependent on how you have Docker setup on your system.
     */
    start: startDocker,
    image: {
        /** Downloads an image if it is missing from the local registry. */
        update: updateImage,
        /** Removes an image from the local registry. */
        remove: removeImageFromLocalRegistry,
        /** Detects if an image exists in the local registry. */
        exists: isImageInLocalRegistry,
    },
    container: {
        /**
         * Get the current status of a container. If the container does not exist at all, the status
         * will be {@link DockerContainerStatus.Removed}.
         */
        getStatus: getContainerStatus,
        /** Wait until a container is running and responsive. */
        waitUntilRunning: waitUntilContainerRunning,
        /**
         * Wait until a container has a status that can be classified as "exited".
         *
         * @see {@link exitedDockerContainerStatuses}
         */
        waitUntilExited: waitUntilContainerExited,
        /** Wait until a container is completely removed. */
        waitUntilRemoved: waitUntilContainerRemoved,
        /**
         * Runs a callback (which presumably will run a command within the given `containerName`)
         * and kills the container if the callback fails.
         */
        tryOrKill: tryOrKillContainer,
        /** Run a container that isn't already running. */
        run: runContainer,
        /** Kill a container. */
        kill: killContainer,
        /** Copy a file or directory to a container. */
        copyTo: copyToContainer,
        /** Run a command on a container that is already running. */
        runCommand: runContainerCommand,
        /** Run `docker inspect` on a container and return its output. */
        getInfo: getContainerInfo,
        /** Get a container's logs. */
        getLogs: getContainerLogs,
    },
    util: {
        /**
         * Manually create a string of volume mapping flags. This is automatically done already
         * inside the run container methods.
         */
        makeVolumeFlags,
        /**
         * Manually create a string of port mapping flags. This is automatically done already inside
         * the run container methods.
         */
        makePortMapFlags,
        /**
         * Manually create a string of env mapping flags. This is automatically done already inside
         * the run container methods.
         */
        makeEnvFlags,
    },
};
