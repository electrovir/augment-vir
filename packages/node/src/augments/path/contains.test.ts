import {describe, itCases} from '@augment-vir/test';
import {doesPathContain} from './contains.js';

describe(doesPathContain.name, () => {
    itCases(doesPathContain, [
        {
            it: 'handles a direct child',
            inputs: [
                'a/b',
                'a/b/c',
            ],
            expect: true,
        },
        {
            it: 'trims trailing slashes on the parent during normalization',
            inputs: [
                'a/b////',
                'a/b/c',
            ],
            expect: true,
        },
        {
            it: 'trims trailing slashes on the child during normalization',
            inputs: [
                'a/b',
                'a/b////c',
            ],
            expect: true,
        },
        {
            it: 'handles a nested child',
            inputs: [
                'a/b',
                'a/b/c/d',
            ],
            expect: true,
        },
        {
            it: 'handles a trailing slash on the parent',
            inputs: [
                'a/b/',
                'a/b/c/d',
            ],
            expect: true,
        },
        {
            it: 'handles a trailing slash on the child',
            inputs: [
                'a/b',
                'a/b/c/d/',
            ],
            expect: true,
        },
        {
            it: 'treats equal paths as not contained',
            inputs: [
                'a/b',
                'a/b',
            ],
            expect: false,
        },
        {
            it: 'treats equal paths as contained',
            inputs: [
                'a/b',
                'a/b',
                {
                    allowSelf: true,
                },
            ],
            expect: true,
        },
        {
            it: 'treats equal paths as contained regardless of trailing slashes',
            inputs: [
                'a/b/',
                'a/b',
                {
                    allowSelf: true,
                },
            ],
            expect: true,
        },
        {
            it: 'does not treat parent as contained by its child',
            inputs: [
                'a/b/c',
                'a/b',
            ],
            expect: false,
        },
        {
            it: 'does not contain a sibling path',
            inputs: [
                'a/b',
                'a/c',
            ],
            expect: false,
        },
        {
            it: 'does not contain similar prefix paths without a directory boundary',
            inputs: [
                'a/b',
                'a/bc',
            ],
            expect: false,
        },
        {
            it: 'does not contain similar prefix paths deeper down',
            inputs: [
                'a/b',
                'a/bc/d',
            ],
            expect: false,
        },
        {
            it: 'normalizes current directory segments',
            inputs: [
                'a/b/./c',
                'a/b/c/d',
            ],
            expect: true,
        },
        {
            it: 'normalizes parent directory segments that resolve within the parent',
            inputs: [
                'a/b',
                'a/../a/b/c',
            ],
            expect: true,
        },
        {
            it: 'detects when child path escapes the parent via ..',
            inputs: [
                'a/b',
                'a/b/../..',
            ],
            expect: false,
        },
        {
            it: 'handles multiple slashes by normalization',
            inputs: [
                'a//b',
                'a/b///c',
            ],
            expect: true,
        },
        {
            it: 'returns false for empty parent',
            inputs: [
                '',
                'a/b',
            ],
            expect: false,
        },
        {
            it: 'returns false for empty child',
            inputs: [
                'a/b',
                '',
            ],
            expect: false,
        },
    ]);
});
