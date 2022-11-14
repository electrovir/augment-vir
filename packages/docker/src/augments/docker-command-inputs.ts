import {isTruthy} from '@augment-vir/common';

export enum VolumeMappingType {
    cached = 'cached',
    delegated = 'delegated',
}

export type VolumeMap = {
    hostAbsolutePath: string;
    containerAbsolutePath: string;
    type?: VolumeMappingType | undefined;
};

export function makeVolumeFlags(volumeMapping?: ReadonlyArray<VolumeMap>): string {
    if (!volumeMapping) {
        return '';
    }

    const parts = volumeMapping.map((volume) => {
        const mountType = volume.type ? `:${volume.type}` : '';
        return `-v '${volume.hostAbsolutePath}':'${volume.containerAbsolutePath}'${mountType}`;
    });

    return parts.join(' ');
}

export type PortMap = {
    hostPort: number;
    containerPort: number;
};

export type EnvMap<RequiredKeys extends string = string> = Readonly<
    Record<
        RequiredKeys | string,
        {
            value: string;
            allowInterpolation: boolean;
        }
    >
>;

export function makePortMapFlags(portMapping?: ReadonlyArray<PortMap> | undefined): string {
    if (!portMapping) {
        return '';
    }

    return portMapping
        .map((portMap) => {
            return `-p ${portMap.hostPort}:${portMap.containerPort}`;
        })
        .join(' ');
}

export function makeEnvFlags(envMapping?: EnvMap | undefined): string {
    if (!envMapping) {
        return '';
    }
    const flags: ReadonlyArray<string> = Object.entries(envMapping).map(
        ([
            key,
            {value, allowInterpolation},
        ]) => {
            const quote = allowInterpolation ? '"' : "'";
            const valueString = `${quote}${value}${quote}`;
            return `-e ${key}=${valueString}`;
        },
    );

    return flags.join(' ');
}

export function combineCommandAndFlags(
    commandsAndFlags: ReadonlyArray<string | undefined | boolean>,
): string {
    return commandsAndFlags.filter(isTruthy).join(' ');
}
