import {describe, itCases} from '@augment-vir/test';
import {extractRelevantArgs} from './relevant-args.js';

describe(extractRelevantArgs.name, () => {
    itCases(extractRelevantArgs, [
        {
            it: 'extracts args from matched file name',
            input: {
                binName: 'my-script',
                fileName: '/Users/your-user/your-package/src/sub-dir/my-script.ts',
                rawArgs: [
                    'npx',
                    'ts-node',
                    './src/sub-dir/my-script.ts',
                    'script-arg',
                    '--more-arg',
                    'more-value',
                ],
            },
            expect: [
                'script-arg',
                '--more-arg',
                'more-value',
            ],
        },
        {
            it: 'errors if no file name is given',
            input: {
                binName: 'my-script',
                fileName: '',
                rawArgs: [
                    'npx',
                    'ts-node',
                    './src/sub-dir/my-script.ts',
                    'script-arg',
                    '--more-arg',
                    'more-value',
                ],
            },
            throws: {
                matchMessage: 'no base file name',
            },
        },
        {
            it: 'extracts args from matched bin name',
            input: {
                binName: 'my-script',
                fileName: '/Users/your-user/your-package/src/sub-dir/my-script.ts',
                rawArgs: [
                    'npx',
                    'ts-node',
                    './node_modules/.bin/my-script',
                    'script-arg',
                    '--more-arg',
                    'more-value',
                ],
            },
            expect: [
                'script-arg',
                '--more-arg',
                'more-value',
            ],
        },
        {
            it: 'does nothing if no match',
            input: {
                binName: 'other-script',
                fileName: '/Users/your-user/your-package/src/sub-dir/other-script.ts',
                rawArgs: [
                    'npx',
                    'ts-node',
                    './src/sub-dir/my-script.ts',
                    'script-arg',
                    '--more-arg',
                    'more-value',
                ],
            },
            expect: [
                'npx',
                'ts-node',
                './src/sub-dir/my-script.ts',
                'script-arg',
                '--more-arg',
                'more-value',
            ],
        },
        {
            it: 'errors if no match and told to error',
            input: {
                binName: 'other-script',
                fileName: '/Users/your-user/your-package/src/sub-dir/other-script.ts',
                rawArgs: [
                    'npx',
                    'ts-node',
                    './src/sub-dir/my-script.ts',
                    'script-arg',
                    '--more-arg',
                    'more-value',
                ],
                errorIfNotFound: true,
            },
            throws: {
                matchMessage: 'Failed to find position of file or bin name in provided args list.',
            },
        },
        {
            it: 'ignores bin name if not provided',
            input: {
                binName: undefined,
                fileName: '/Users/your-user/your-package/src/sub-dir/my-script.ts',
                rawArgs: [
                    'npx',
                    'ts-node',
                    './src/sub-dir/my-script',
                    'script-arg',
                    '--more-arg',
                    'more-value',
                ],
            },
            expect: [
                'npx',
                'ts-node',
                './src/sub-dir/my-script',
                'script-arg',
                '--more-arg',
                'more-value',
            ],
        },
    ]);
});
