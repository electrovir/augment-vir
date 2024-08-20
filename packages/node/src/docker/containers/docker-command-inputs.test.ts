import {describe, itCases} from '@augment-vir/test';
import {
    DockerVolumeMappingType,
    makeEnvFlags,
    makePortMapFlags,
    makeVolumeFlags,
} from './docker-command-inputs.js';

describe(makeVolumeFlags.name, () => {
    itCases(makeVolumeFlags, [
        {
            it: 'handles an empty array',
            input: [],
            expect: '',
        },
        {
            it: 'handles undefined',
            input: undefined,
            expect: '',
        },
        {
            it: 'maps',
            input: [
                {
                    containerAbsolutePath: '/tmp/hi',
                    hostAbsolutePath: '/users/home/hi',
                },
                {
                    containerAbsolutePath: '/tmp/bye',
                    hostAbsolutePath: '/users/home/bye',
                    type: DockerVolumeMappingType.Cached,
                },
            ],
            expect: "-v '/users/home/hi':'/tmp/hi' -v '/users/home/bye':'/tmp/bye':cached",
        },
    ]);
});

describe(makePortMapFlags.name, () => {
    itCases(makePortMapFlags, [
        {
            it: 'handles an empty array',
            input: [],
            expect: '',
        },
        {
            it: 'handles undefined',
            input: undefined,
            expect: '',
        },
        {
            it: 'handles undefined',
            input: [
                {
                    hostPort: 1234,
                    containerPort: 9876,
                },
                {
                    hostPort: 42,
                    containerPort: 98,
                },
            ],
            expect: '-p 1234:9876 -p 42:98',
        },
    ]);
});

describe(makeEnvFlags.name, () => {
    itCases(makeEnvFlags, [
        {
            it: 'handles an empty map',
            input: {},
            expect: '',
        },
        {
            it: 'handles undefined',
            input: undefined,
            expect: '',
        },
        {
            it: 'maps',
            input: {
                CONTAINER_ONE: {
                    allowInterpolation: false,
                    value: 'value 1',
                },
                CONTAINER_TWO: {
                    allowInterpolation: true,
                    value: 'VALUE_2',
                },
            },
            expect: '-e CONTAINER_ONE=\'value 1\' -e CONTAINER_TWO="VALUE_2"',
        },
    ]);
});
