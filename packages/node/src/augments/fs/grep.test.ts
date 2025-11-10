import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {nodePackageDir} from '../../file-paths.mock.js';
import {grep} from './grep.js';

describe(grep.name, () => {
    itCases(grep, [
        {
            it: 'greps multiple directories',
            inputs: [
                {
                    patterns: ['@category Internal'],
                },
                {
                    dirs: [
                        join(nodePackageDir, 'src', 'augments', 'fs'),
                        join(nodePackageDir, 'src', 'augments', 'npm'),
                    ],
                },
                {
                    excludePatterns: ['grep.test.ts'],
                    matchType: {
                        wordRegExp: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'augments', 'fs', 'grep.ts')]: [
                    ' * @category Internal',
                    ' * @category Internal',
                    ' * @category Internal',
                    ' * @category Internal',
                ],
                [join(nodePackageDir, 'src', 'augments', 'npm', 'npm-deps.ts')]: [
                    ' * @category Internal',
                    ' * @category Internal',
                ],
            },
        },
        {
            it: 'greps a directory without recursion',
            inputs: [
                {
                    patterns: ['import'],
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    matchType: {
                        wordRegExp: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'file-paths.mock.ts')]: [
                    "import {dirname, join} from 'node:path';",
                    'export const monoRepoDirPath = dirname(dirname(dirname(import.meta.dirname)));',
                    'export const nodePackageDir = dirname(import.meta.dirname);',
                ],
                [join(nodePackageDir, 'src', 'index.test.ts')]: [
                    "import {assert} from '@augment-vir/assert';",
                    "import {describe, it} from '@augment-vir/test';",
                    "        assert.isDefined(await import('./index.js'));",
                ],
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/path/resolve-import.js';",
                ],
            },
        },
        {
            it: 'uses line-regexp match type',
            inputs: [
                {
                    pattern: "export * from './augments/fs/dir-contents.js';",
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    patternSyntax: {
                        fixedStrings: true,
                    },
                    matchType: {
                        lineRegExp: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'uses extended regular expressions',
            inputs: [
                {
                    pattern: 'export .*dir-contents',
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    patternSyntax: {
                        extendedRegExp: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'uses fixed strings',
            inputs: [
                {
                    pattern: "export * from './augments/fs/dir-contents.js';",
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    patternSyntax: {
                        fixedStrings: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'uses basic RegExp',
            inputs: [
                {
                    pattern: '.*dir-contents',
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    patternSyntax: {
                        basicRegExp: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'ignores case',
            inputs: [
                {
                    pattern: 'EXPORT',
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    ignoreCase: true,
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                    "export * from './augments/fs/download.js';",
                    "export * from './augments/fs/grep.js';",
                    "export * from './augments/fs/json.js';",
                    "export * from './augments/fs/read-dir.js';",
                    "export * from './augments/fs/read-file.js';",
                    "export * from './augments/fs/symlink.js';",
                    "export * from './augments/fs/write.js';",
                    "export * from './augments/npm/find-bin-path.js';",
                    "export * from './augments/npm/npm-deps.js';",
                    "export * from './augments/npm/package-json.js';",
                    "export * from './augments/npm/query-workspace.js';",
                    "export * from './augments/npm/read-package-json.js';",
                    "export * from './augments/os/operating-system.js';",
                    "export * from './augments/path/ancestor.js';",
                    "export * from './augments/path/contains.js';",
                    "export * from './augments/path/os-path.js';",
                    "export * from './augments/path/resolve-import.js';",
                    "export * from './augments/path/root.js';",
                    "export * from './augments/terminal/question.js';",
                    "export * from './augments/terminal/relevant-args.js';",
                    "export * from './augments/terminal/run-cli-script.js';",
                    "export * from './augments/terminal/shell.js';",
                    "export * from './augments/typescript/read-tsconfig.js';",
                ],
            },
        },
        {
            it: 'inverts match',
            inputs: [
                {
                    pattern: 'import',
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    invertMatch: true,
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                    "export * from './augments/fs/download.js';",
                    "export * from './augments/fs/grep.js';",
                    "export * from './augments/fs/json.js';",
                    "export * from './augments/fs/read-dir.js';",
                    "export * from './augments/fs/read-file.js';",
                    "export * from './augments/fs/symlink.js';",
                    "export * from './augments/fs/write.js';",
                    "export * from './augments/npm/find-bin-path.js';",
                    "export * from './augments/npm/npm-deps.js';",
                    "export * from './augments/npm/package-json.js';",
                    "export * from './augments/npm/query-workspace.js';",
                    "export * from './augments/npm/read-package-json.js';",
                    "export * from './augments/os/operating-system.js';",
                    "export * from './augments/path/ancestor.js';",
                    "export * from './augments/path/contains.js';",
                    "export * from './augments/path/os-path.js';",
                    "export * from './augments/path/root.js';",
                    "export * from './augments/terminal/question.js';",
                    "export * from './augments/terminal/relevant-args.js';",
                    "export * from './augments/terminal/run-cli-script.js';",
                    "export * from './augments/terminal/shell.js';",
                    "export * from './augments/typescript/read-tsconfig.js';",
                ],
            },
        },
        {
            it: 'counts matches only',
            inputs: [
                {
                    pattern: 'export',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    recursive: true,
                    excludeDirs: ['augments'],
                    output: {
                        countOnly: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'file-paths.mock.ts')]: 12,
                [join(nodePackageDir, 'src', 'index.ts')]: 25,
            },
        },
        {
            it: 'handles no matches',
            inputs: [
                {
                    pattern: 'this will not match anywhere',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    recursive: true,
                    excludeDirs: ['augments'],
                },
            ],
            expect: {},
        },
        {
            it: 'returns files only',
            inputs: [
                {
                    pattern: 'export',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    output: {
                        filesOnly: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'file-paths.mock.ts')]: [],
                [join(nodePackageDir, 'src', 'index.ts')]: [],
            },
        },
        {
            it: 'returns inverted files only',
            inputs: [
                {
                    pattern: 'export',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    printCommand: true,
                    invertMatch: true,
                    recursive: true,
                    output: {
                        filesOnly: true,
                    },
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'augments', 'fs', 'download.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'fs', 'json.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'fs', 'read-dir.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'fs', 'read-file.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'fs', 'symlink.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'fs', 'write.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'npm', 'find-bin-path.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'npm', 'npm-deps.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'npm', 'package-json.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'npm', 'read-package-json.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'os', 'operating-system.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'path', 'ancestor.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'path', 'contains.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'path', 'os-path.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'path', 'resolve-import.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'path', 'root.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'path', 'sanitize-path.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'terminal', 'question.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'terminal', 'relevant-args.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'terminal', 'shell.test.ts')]: [],
                [join(nodePackageDir, 'src', 'augments', 'typescript', 'read-tsconfig.test.ts')]:
                    [],
                [join(nodePackageDir, 'src', 'index.test.ts')]: [],
                [join(nodePackageDir, 'src', 'scripts', 'fix-src-imports.script.ts')]: [],
                [join(nodePackageDir, 'src', 'scripts', 'fix-ts-bin.script.ts')]: [],
            },
        },
        {
            it: 'excludes file via excludePattern',
            inputs: [
                {
                    pattern: 'export',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    excludePatterns: ['index.ts'],
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'file-paths.mock.ts')]: [
                    'export const monoRepoDirPath = dirname(dirname(dirname(import.meta.dirname)));',
                    "export const notCommittedDirPath = join(monoRepoDirPath, '.not-committed');",
                    'export const nodePackageDir = dirname(import.meta.dirname);',
                    "export const testFilesDir = join(nodePackageDir, 'test-files');",
                    "export const dirContentsTestDir = join(testFilesDir, 'dir-contents-test');",
                    "export const longRunningFilePath = join(longRunningFileDir, 'long-running-file.ts');",
                    'export const longRunningFileWithStderr = join(',
                    "export const workspaceQueryDir = join(testFilesDir, 'workspace-query');",
                    "export const workspaceQueryPackageJsonPath = join(workspaceQueryDir, 'package.json');",
                    "export const tempWorkspaceQueryFile = join(workspaceQueryDir, 'temp-workspace-query-output.ts');",
                    "export const recursiveFileReadDir = join(testFilesDir, 'recursive-reading');",
                    "export const invalidPackageDirPath = join(testFilesDir, 'invalid-package');",
                ],
            },
        },
        {
            it: 'truncates via maxCount',
            inputs: [
                {
                    pattern: 'export',
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    maxCount: 1,
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'insert symlink follow',
            inputs: [
                {
                    pattern: 'node:coverage',
                },
                {
                    dir: join(nodePackageDir, 'src', 'scripts'),
                },
                {
                    recursive: true,
                    followSymLinks: true,
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'scripts', 'fix-src-imports.script.ts')]: [
                    '/* node:coverage disable */',
                ],
                [join(nodePackageDir, 'src', 'scripts', 'fix-ts-bin.script.ts')]: [
                    '/* node:coverage disable */',
                ],
            },
        },
        {
            it: 'excludes dirs',
            inputs: [
                {
                    pattern: 'dirname',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    recursive: true,
                    excludeDirs: [
                        'augments',
                    ],
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'file-paths.mock.ts')]: [
                    "import {dirname, join} from 'node:path';",
                    'export const monoRepoDirPath = dirname(dirname(dirname(import.meta.dirname)));',
                    'export const nodePackageDir = dirname(import.meta.dirname);',
                ],
                [join(nodePackageDir, 'src', 'scripts', 'fix-ts-bin.script.ts')]: [
                    '        `npx tsx "$(dirname "$(dirname "$(readlink -f "$0")")")${sep}${scriptPath}" "$@"`,',
                ],
            },
        },
        {
            it: 'filters to specific files via includeFiles',
            inputs: [
                {
                    pattern: 'dir-contents.js',
                },
                {
                    dir: join(nodePackageDir, 'src'),
                },
                {
                    includeFiles: ['index.ts'],
                    recursive: true,
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'treats file as binary (still matches)',
            inputs: [
                {
                    pattern: 'dir-contents.js',
                },
                {
                    file: join(nodePackageDir, 'src', 'index.ts'),
                },
                {
                    binary: true,
                },
            ],
            expect: {
                [join(nodePackageDir, 'src', 'index.ts')]: [
                    "export * from './augments/fs/dir-contents.js';",
                ],
            },
        },
        {
            it: 'ignores no search',
            inputs: [
                {
                    pattern: 'dir-contents.js',
                },
                {
                    files: [],
                },
            ],
            expect: {},
        },
        {
            it: 'ignores no patterns',
            inputs: [
                {
                    patterns: [],
                },
                {
                    files: [],
                },
            ],
            expect: {},
        },
        {
            it: 'ignores missing location',
            inputs: [
                {
                    patterns: ['something'],
                },
                // @ts-expect-error: intentionally incorrect grep location
                {},
            ],
            expect: {},
        },
    ]);

    it('changes output type when only counting', async () => {
        const output = await grep(
            {
                pattern: 'export',
            },
            {
                dir: join(nodePackageDir, 'src'),
            },
            {
                recursive: true,
                excludeDirs: ['augments'],
                output: {
                    countOnly: true,
                },
            },
        );

        assert.tsType(output).equals<Record<string, number>>();
    });
    it('prints the grep command', async () => {
        await grep(
            {
                pattern: 'export',
            },
            {
                dir: join(nodePackageDir, 'src'),
            },
            {
                printCommand: true,
            },
        );
    });

    it('uses normal output type', async () => {
        const output = await grep(
            {
                pattern: 'export',
            },
            {
                file: join(nodePackageDir, 'src', 'index.ts'),
            },
            {
                maxCount: 1,
            },
        );

        assert.tsType(output).equals<Record<string, string[]>>();
    });
});
