import {wrapString} from '@augment-vir/common';

export enum DockerVolumeMappingType {
    Cached = 'cached',
    Delegated = 'delegated',
}

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

export type DockerPortMap = {
    hostPort: number;
    containerPort: number;
};

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
