import {type prettyDiff} from './pretty-diff.js';

export const mockPrettyDiffTestCases: {it: string; inputs: Parameters<typeof prettyDiff>}[] = [
    {
        it: 'handles strings',
        inputs: [
            'hello there why',
            'hello what why',
        ],
    },
    {
        it: 'handles objects',
        inputs: [
            {
                a: 'hello there',
                b: 'goodbye now',
            },
            {
                a: 'hello there',
            },
        ],
    },
    {
        it: 'handles numbers',
        inputs: [
            52,
            40,
        ],
    },
    {
        it: 'expected object but got string',
        inputs: [
            'hello there',
            {
                a: 'hello there',
            },
        ],
    },
    {
        it: 'expected string but got object',
        inputs: [
            {
                a: 'hello there',
            },
            'hello there',
        ],
    },
    {
        it: 'expected number but got string',
        inputs: [
            'hello there',
            42,
        ],
    },
    {
        it: 'expected string but got number',
        inputs: [
            42,
            'hello there',
        ],
    },
    {
        it: 'got completely different strings',
        inputs: [
            'nothing here',
            'hello there',
        ],
    },
];
