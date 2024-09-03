import {wrapString} from '@augment-vir/common';

/**
 * Used for `type` in {@link DockerVolumeMap}. These types are apparently only relevant for running
 * Docker on macOS and are potentially irrelevant now. It's likely best to leave the `type` property
 * empty (`undefined`).
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export enum DockerVolumeMappingType {
    Cached = 'cached',
    Delegated = 'delegated',
}

/**
 * A mapping of a single docker volume for mounting host files to a container.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type DockerVolumeMap = {
    hostAbsolutePath: string;
    containerAbsolutePath: string;
    type?: DockerVolumeMappingType | undefined;
};

export function makeVolumeFlags(volumeMapping?: ReadonlyArray<DockerVolumeMap>): string {
    if (!volumeMapping) {
        return '';
    }

    const parts = volumeMapping.map((volume) => {
        const mountType = volume.type ? `:${volume.type}` : '';
        return `-v '${volume.hostAbsolutePath}':'${volume.containerAbsolutePath}'${mountType}`;
    });

    return parts.join(' ');
}
/**
 * A single docker container port mapping. This is usually used in an array.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type DockerPortMap = {
    hostPort: number;
    containerPort: number;
};

/**
 * A set of environment mappings for a docker container.
 *
 * - Each key in this object represents the env var name within the Docker container.
 * - Each `value` property can be either the value that the env var should be set to _or_ an existing
 *   env var's interpolation into the value.
 * - If the value string is meant to be interpolated within the shell context, make sure to set
 *   `allowInterpolation` to `true`. Otherwise, it's best to leave it as `false`.
 *
 * @category Node : Docker : Util
 * @category Package : @augment-vir/node
 * @example
 *
 * ```ts
 * const envMapping: DockerEnvMap = {
 *     VAR_1: {
 *         value: 'hi',
 *         // set to false because this is a raw string value that is not meant to be interpolated
 *         allowInterpolation: false,
 *     },
 *     VAR_2: {
 *         // the value here will be interpolated from the current shell's value for `EXISTING_VAR`
 *         value: '$EXISTING_VAR',
 *         // set to true to allow '$EXISTING_VAR' to be interpolated by the shell
 *         allowInterpolation: true,
 *     },
 * };
 * ```
 *
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type DockerEnvMap<RequiredKeys extends string = string> = Readonly<
    Record<
        RequiredKeys | string,
        {
            value: string;
            allowInterpolation: boolean;
        }
    >
>;

export function makePortMapFlags(portMapping?: ReadonlyArray<DockerPortMap> | undefined): string {
    if (!portMapping) {
        return '';
    }

    return portMapping
        .map((portMap) => {
            return `-p ${portMap.hostPort}:${portMap.containerPort}`;
        })
        .join(' ');
}

export function makeEnvFlags(envMapping?: DockerEnvMap | undefined): string {
    if (!envMapping) {
        return '';
    }
    const flags: ReadonlyArray<string> = Object.entries(envMapping).map(
        ([
            key,
            {value, allowInterpolation},
        ]) => {
            const quote = allowInterpolation ? '"' : "'";
            return `-e ${key}=${wrapString({value, wrapper: quote})}`;
        },
    );

    return flags.join(' ');
}
