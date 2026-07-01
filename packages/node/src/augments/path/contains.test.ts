import {describe, itCases} from '@augment-vir/test';
import {doesPathContain} from './contains.js';

describe(doesPathContain.name, () => {
    itCases(doesPathContain, [
        {
            it: 'handles a direct child',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b/c',
            },
            expect: true,
        },
        {
            it: 'trims trailing slashes on the parent during normalization',
            input: {
                potentialParentPath: 'a/b////',
                potentialChildPath: 'a/b/c',
            },
            expect: true,
        },
        {
            it: 'trims trailing slashes on the child during normalization',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b////c',
            },
            expect: true,
        },
        {
            it: 'handles a nested child',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b/c/d',
            },
            expect: true,
        },
        {
            it: 'handles a trailing slash on the parent',
            input: {
                potentialParentPath: 'a/b/',
                potentialChildPath: 'a/b/c/d',
            },
            expect: true,
        },
        {
            it: 'handles a trailing slash on the child',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b/c/d/',
            },
            expect: true,
        },
        {
            it: 'treats equal paths as not contained',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b',
            },
            expect: false,
        },
        {
            it: 'treats equal paths as contained',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b',
                options: {
                    allowSelf: true,
                },
            },
            expect: true,
        },
        {
            it: 'treats equal paths as contained regardless of trailing slashes',
            input: {
                potentialParentPath: 'a/b/',
                potentialChildPath: 'a/b',
                options: {
                    allowSelf: true,
                },
            },
            expect: true,
        },
        {
            it: 'does not treat parent as contained by its child',
            input: {
                potentialParentPath: 'a/b/c',
                potentialChildPath: 'a/b',
            },
            expect: false,
        },
        {
            it: 'does not contain a sibling path',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/c',
            },
            expect: false,
        },
        {
            it: 'does not contain similar prefix paths without a directory boundary',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/bc',
            },
            expect: false,
        },
        {
            it: 'does not contain similar prefix paths deeper down',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/bc/d',
            },
            expect: false,
        },
        {
            it: 'normalizes current directory segments',
            input: {
                potentialParentPath: 'a/b/./c',
                potentialChildPath: 'a/b/c/d',
            },
            expect: true,
        },
        {
            it: 'normalizes parent directory segments that resolve within the parent',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/../a/b/c',
            },
            expect: true,
        },
        {
            it: 'detects when child path escapes the parent via ..',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: 'a/b/../..',
            },
            expect: false,
        },
        {
            it: 'handles multiple slashes by normalization',
            input: {
                potentialParentPath: 'a//b',
                potentialChildPath: 'a/b///c',
            },
            expect: true,
        },
        {
            it: 'returns false for empty parent',
            input: {
                potentialParentPath: '',
                potentialChildPath: 'a/b',
            },
            expect: false,
        },
        {
            it: 'returns false for empty child',
            input: {
                potentialParentPath: 'a/b',
                potentialChildPath: '',
            },
            expect: false,
        },
    ]);
});
