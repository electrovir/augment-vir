import {describe, itCases} from '@augment-vir/test';
import {extractExtension, hasExtension, replaceExtension} from './universal-path.js';

describe(extractExtension.name, () => {
    itCases(extractExtension, [
        {
            it: 'handles an absolute posix path with extension',
            inputs: [
                '/users/stuff/file.ts',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '.ts',
                tail: '',
            },
        },
        {
            it: 'handles an absolute posix path with extension and tail',
            inputs: [
                '/users/stuff/file.ts?tail',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '.ts',
                tail: '?tail',
            },
        },
        {
            it: 'handles a relative posix path with extension',
            inputs: [
                'users/stuff/file.ts',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: 'users/stuff/',
                extension: '.ts',
                tail: '',
            },
        },
        {
            it: 'handles an absolute dos path with extension',
            inputs: [
                String.raw`\users\stuff\file.ts`,
                '\\',
            ],
            expect: {
                basename: 'file',
                dirname: '\\users\\stuff\\',
                extension: '.ts',
                tail: '',
            },
        },
        {
            it: 'handles a relative dos path with extension',
            inputs: [
                String.raw`users\stuff\file.ts`,
                '\\',
            ],
            expect: {
                basename: 'file',
                dirname: 'users\\stuff\\',
                extension: '.ts',
                tail: '',
            },
        },
        // Additional edge cases
        {
            it: 'handles absolute posix path with no extension',
            inputs: [
                '/users/stuff/file',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles absolute posix path with no extension and tail',
            inputs: [
                '/users/stuff/file?tail',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '',
                tail: '?tail',
            },
        },
        {
            it: 'handles hidden dotfile with no extension',
            inputs: [
                '/users/stuff/.env',
                '/',
            ],
            expect: {
                basename: '.env',
                dirname: '/users/stuff/',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles hidden dotfile with secondary extension',
            inputs: [
                '/users/stuff/.env.local',
                '/',
            ],
            expect: {
                basename: '.env',
                dirname: '/users/stuff/',
                extension: '.local',
                tail: '',
            },
        },
        {
            it: 'handles multi-part extension keeping only last part as extension',
            inputs: [
                '/users/stuff/file.tar.gz',
                '/',
            ],
            expect: {
                basename: 'file.tar',
                dirname: '/users/stuff/',
                extension: '.gz',
                tail: '',
            },
        },
        {
            it: 'handles directory path ending with slash',
            inputs: [
                '/users/stuff/',
                '/',
            ],
            expect: {
                basename: '',
                dirname: '/users/stuff/',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles relative directory path ending with slash',
            inputs: [
                'users/stuff/',
                '/',
            ],
            expect: {
                basename: '',
                dirname: 'users/stuff/',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles path with hash tail',
            inputs: [
                '/users/stuff/file.ts#hash',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '.ts',
                tail: '#hash',
            },
        },
        {
            it: 'handles path with hash and query tail (hash first)',
            inputs: [
                '/users/stuff/file.ts#hash?query=1',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '.ts',
                tail: '#hash?query=1',
            },
        },
        {
            it: 'handles path with query and hash tail (query first)',
            inputs: [
                '/users/stuff/file.ts?query=1#hash',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff/',
                extension: '.ts',
                tail: '?query=1#hash',
            },
        },
        {
            it: 'handles path with dot in directory name and no file extension',
            inputs: [
                '/users/stuff.v1/file',
                '/',
            ],
            expect: {
                basename: 'file',
                dirname: '/users/stuff.v1/',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles empty string path',
            inputs: [
                '',
                '/',
            ],
            expect: {
                basename: '',
                dirname: '',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles single dot path',
            inputs: [
                '.',
                '/',
            ],
            expect: {
                basename: '.',
                dirname: '',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles double dot path',
            inputs: [
                '..',
                '/',
            ],
            expect: {
                basename: '.',
                dirname: '',
                extension: '.',
                tail: '',
            },
        },
        {
            it: 'handles windows path with no extension',
            inputs: [
                String.raw`users\stuff\file`,
                '\\',
            ],
            expect: {
                basename: 'file',
                dirname: 'users\\stuff\\',
                extension: '',
                tail: '',
            },
        },
        {
            it: 'handles windows path with query tail and no extension',
            inputs: [
                String.raw`users\stuff\file?tail`,
                '\\',
            ],
            expect: {
                basename: 'file',
                dirname: 'users\\stuff\\',
                extension: '',
                tail: '?tail',
            },
        },
        {
            it: 'handles windows path with hidden file and extension',
            inputs: [
                String.raw`C:\users\stuff\.env.local`,
                '\\',
            ],
            expect: {
                basename: '.env',
                dirname: 'C:\\users\\stuff\\',
                extension: '.local',
                tail: '',
            },
        },
    ]);
});

describe(replaceExtension.name, () => {
    itCases(replaceExtension, [
        {
            it: 'replaces an extension with a leading dot',
            input: {
                path: '/users/stuff/file.ts',
                newExtension: '.js',
            },
            expect: '/users/stuff/file.js',
        },
        {
            it: 'replaces an extension without a leading dot',
            input: {
                path: '/users/stuff/file.ts',
                newExtension: 'js',
            },
            expect: '/users/stuff/file.js',
        },
        {
            it: 'handles a relative path',
            input: {
                path: 'users/stuff/file.ts',
                newExtension: '.js',
            },
            expect: 'users/stuff/file.js',
        },
        {
            it: 'handles a tail',
            input: {
                path: 'users/stuff/file.ts?stuff',
                newExtension: '.js',
            },
            expect: 'users/stuff/file.js?stuff',
        },
        {
            it: 'appends the extension',
            input: {
                path: 'users/stuff/file',
                newExtension: '.js',
            },
            expect: 'users/stuff/file.js',
        },
        {
            it: 'handles a dos path',
            input: {
                path: String.raw`users\stuff\file.ts`,
                newExtension: '.js',
            },
            expect: String.raw`users\stuff\file.js`,
        },
    ]);
});

describe(hasExtension.name, () => {
    itCases(hasExtension, [
        {
            it: 'finds an extension',
            input: 'file.ts',
            expect: true,
        },
        {
            it: 'does not find an extension',
            input: 'file',
            expect: false,
        },
        {
            it: 'handles dos path with extension',
            input: String.raw`\users\stuff\file.ts`,
            expect: true,
        },
        {
            it: 'handles dos path without extension',
            input: String.raw`\users\stuff\file`,
            expect: false,
        },
        {
            it: 'handles posix path with extension',
            input: '/users/stuff/file.ts',
            expect: true,
        },
        {
            it: 'handles posix path without extension',
            input: '/users/stuff/file',
            expect: false,
        },
    ]);
});
