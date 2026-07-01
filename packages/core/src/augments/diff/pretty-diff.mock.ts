import {type prettyDiff} from './pretty-diff.js';

export const mockPrettyDiffTestCases: {it: string; input: Parameters<typeof prettyDiff>[0]}[] = [
    {
        it: 'handles strings',
        input: {
            actual: 'hello there why',
            expected: 'hello what why',
        },
    },
    {
        it: 'handles objects',
        input: {
            actual: {
                a: 'hello there',
                b: 'goodbye now',
            },
            expected: {
                a: 'hello there',
            },
        },
    },
    {
        it: 'handles numbers',
        input: {
            actual: 52,
            expected: 40,
        },
    },
    {
        it: 'expected object but got string',
        input: {
            actual: 'hello there',
            expected: {
                a: 'hello there',
            },
        },
    },
    {
        it: 'expected string but got object',
        input: {
            actual: {
                a: 'hello there',
            },
            expected: 'hello there',
        },
    },
    {
        it: 'expected number but got string',
        input: {
            actual: 'hello there',
            expected: 42,
        },
    },
    {
        it: 'expected string but got number',
        input: {
            actual: 42,
            expected: 'hello there',
        },
    },
    {
        it: 'got completely different strings',
        input: {
            actual: 'nothing here',
            expected: 'hello there',
        },
    },
];
