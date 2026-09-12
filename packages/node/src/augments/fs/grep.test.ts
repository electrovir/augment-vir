import {assert} from '@augment-vir/assert';
import {type MaybePromise} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {chmod, mkdir, mkdtemp, rm, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {nodePackageDir} from '../../file-paths.mock.js';
import {grep, type GrepOptions, type GrepSearchLocation, type GrepSearchPattern} from './grep.js';

// cspell:word mkfifo

type GrepShellInjectionPaths = {
    sentinelFilePath: string;
    sourceFilePath: string;
    testDir: string;
};

type GrepShellInjectionParams = {
    grepSearchLocation: GrepSearchLocation;
    grepSearchPattern: GrepSearchPattern;
    options?: GrepOptions | Readonly<Record<string, unknown>> | undefined;
};

type CreateGrepShellInjectionParams = (
    paths: Readonly<GrepShellInjectionPaths>,
) => GrepShellInjectionParams;

type GrepFixturePaths = {
    colonFilePath: string;
    dashFilePath: string;
    hiddenFilePath: string;
    linkedNestedDirPath: string;
    linkedNestedFilePath: string;
    newlineFilePath: string;
    nestedDirPath: string;
    nestedFilePath: string;
    notesFilePath: string;
    otherFilePath: string;
    skipDirPath: string;
    skippedFilePath: string;
    spacedFilePath: string;
    testDir: string;
    whitespaceFilePath: string;
};

type GrepSymlinkSearchRootPaths = {
    linkedDirPath: string;
    linkedFilePath: string;
};

const grepWithRuntimeOptions = grep satisfies typeof grep as (
    grepSearchPattern: Readonly<GrepSearchPattern>,
    grepSearchLocation: Readonly<GrepSearchLocation>,
    options?: Readonly<GrepOptions | Record<string, unknown>> | undefined,
) => Promise<unknown>;

const grepWithRuntimeInputs = grep satisfies typeof grep as (
    grepSearchPattern: unknown,
    grepSearchLocation: unknown,
    options?: unknown,
) => Promise<unknown>;

async function withGrepFixture(
    callback: (paths: Readonly<GrepFixturePaths>) => MaybePromise<void>,
) {
    const testDir = await mkdtemp(join(tmpdir(), 'augment-vir-grep-'));
    const nestedDirPath = join(testDir, 'nested');
    const skipDirPath = join(testDir, 'skip-dir');
    const fixturePaths: GrepFixturePaths = {
        colonFilePath: join(testDir, 'colon:name.txt'),
        dashFilePath: join(testDir, '-dash-file.txt'),
        hiddenFilePath: join(testDir, '.hidden.txt'),
        linkedNestedDirPath: join(testDir, 'linked-nested'),
        linkedNestedFilePath: join(testDir, 'linked-nested', 'nested.md'),
        newlineFilePath: join(testDir, 'new\nline.txt'),
        nestedDirPath,
        nestedFilePath: join(nestedDirPath, 'nested.md'),
        notesFilePath: join(testDir, 'notes.txt'),
        otherFilePath: join(testDir, 'other.log'),
        skipDirPath,
        skippedFilePath: join(skipDirPath, 'skipped.txt'),
        spacedFilePath: join(testDir, 'space file.txt'),
        testDir,
        whitespaceFilePath: join(testDir, 'whitespace.txt'),
    };

    try {
        await mkdir(fixturePaths.nestedDirPath);
        await mkdir(fixturePaths.skipDirPath);
        await Promise.all([
            writeFile(
                fixturePaths.notesFilePath,
                [
                    'Alpha one',
                    'alpha two',
                    'Beta only',
                    'alphabet soup',
                    'literal .* token',
                    'line-exact',
                    'prefix-line-exact-suffix',
                    '-dash pattern',
                    "quote's pattern",
                ].join('\n'),
            ),
            writeFile(
                fixturePaths.otherFilePath,
                [
                    'Gamma one',
                    'Alpha other',
                    'beta other',
                    'no target here',
                ].join('\n'),
            ),
            writeFile(fixturePaths.spacedFilePath, 'Alpha spaced\n'),
            writeFile(fixturePaths.dashFilePath, '-dash file content\nAlpha dash file\n'),
            writeFile(fixturePaths.colonFilePath, 'Alpha colon\n'),
            writeFile(fixturePaths.hiddenFilePath, 'Alpha hidden\n'),
            writeFile(fixturePaths.nestedFilePath, 'Alpha nested\nNested only\n'),
            writeFile(fixturePaths.skippedFilePath, 'Alpha skipped\n'),
            writeFile(
                fixturePaths.whitespaceFilePath,
                [
                    '  target leading',
                    'middle target   ',
                    '\t target tab\t',
                ].join('\n'),
            ),
        ]);
        await symlink(fixturePaths.nestedDirPath, fixturePaths.linkedNestedDirPath, 'dir');

        await callback(fixturePaths);
    } finally {
        await rm(testDir, {
            force: true,
            recursive: true,
        });
    }
}

async function withGrepSymlinkSearchRootFixture(
    callback: (paths: Readonly<GrepSymlinkSearchRootPaths>) => MaybePromise<void>,
) {
    const testDir = await mkdtemp(join(tmpdir(), 'augment-vir-grep-'));
    const outsideDirPath = join(testDir, 'outside');
    const linkedDirPath = join(testDir, 'linked-dir');
    const linkedDirSourceFilePath = join(outsideDirPath, 'outside.txt');
    const linkedFilePath = join(testDir, 'linked-file.txt');

    try {
        await mkdir(outsideDirPath);
        await writeFile(linkedDirSourceFilePath, 'Alpha outside\n');
        await symlink(outsideDirPath, linkedDirPath, 'dir');
        await symlink(linkedDirSourceFilePath, linkedFilePath);

        await callback({
            linkedDirPath,
            linkedFilePath,
        });
    } finally {
        await rm(testDir, {
            force: true,
            recursive: true,
        });
    }
}

async function assertGrepDoesNotCreateSentinel({
    createParams,
}: Readonly<{
    createParams: CreateGrepShellInjectionParams;
}>) {
    const testDir = await mkdtemp(join(tmpdir(), 'augment-vir-grep-'));
    const sourceFilePath = join(testDir, 'source.txt');
    const sentinelFilePath = join(testDir, 'sentinel.txt');

    try {
        await writeFile(sourceFilePath, 'safe content\n');

        const params = createParams({
            sentinelFilePath,
            sourceFilePath,
            testDir,
        });
        const output = await grepWithRuntimeOptions(
            params.grepSearchPattern,
            params.grepSearchLocation,
            params.options,
        );

        assert.deepEquals(
            {
                didCreateSentinel: existsSync(sentinelFilePath),
                output,
            },
            {
                didCreateSentinel: false,
                output: {},
            },
        );
    } finally {
        await rm(testDir, {
            force: true,
            recursive: true,
        });
    }
}

async function createNamedPipe(namedPipePath: string) {
    return new Promise<void>((resolvePipe, rejectPipe) => {
        const namedPipeProcess = spawn(
            '/usr/bin/mkfifo',
            [
                namedPipePath,
            ],
            {
                stdio: [
                    'ignore',
                    'ignore',
                    'ignore',
                ],
            },
        );

        namedPipeProcess.on('error', rejectPipe);
        namedPipeProcess.on('close', (rawExitCode) => {
            if (rawExitCode === 0) {
                resolvePipe();
            } else {
                rejectPipe(new Error('Failed to create named pipe.'));
            }
        });
    });
}

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
                    "export * from './augments/fs/walk-files.js';",
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
                    "export * from './augments/fs/walk-files.js';",
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
        const output = await grep(
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

        assert.isDefined(output);
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

    describe('temp fixture behavior', () => {
        it('finds matches in a single file', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: notesFilePath,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('finds matches across multiple files', async () => {
            await withGrepFixture(async ({notesFilePath, otherFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            files: [
                                notesFilePath,
                                otherFilePath,
                            ],
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                        [otherFilePath]: [
                            'Alpha other',
                        ],
                    },
                );
            });
        });

        it('supports multiple patterns', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            patterns: [
                                'Alpha',
                                'Beta',
                            ],
                        },
                        {
                            file: notesFilePath,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                            'Beta only',
                        ],
                    },
                );
            });
        });

        it('ignores empty patterns inside a pattern list', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            patterns: [
                                '',
                                'Beta',
                            ],
                        },
                        {
                            file: notesFilePath,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Beta only',
                        ],
                    },
                );
            });
        });

        it('returns no matches when every pattern is empty', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            patterns: [
                                '',
                            ],
                        },
                        {
                            file: notesFilePath,
                        },
                    ),
                    {},
                );
            });
        });

        it('uses fixed strings for regex-looking patterns', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: '.*',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            patternSyntax: {
                                fixedStrings: true,
                            },
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'literal .* token',
                        ],
                    },
                );
            });
        });

        it('uses basic regular expressions by default', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha.*',
                        },
                        {
                            file: notesFilePath,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('uses extended regular expressions', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha|Beta',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            patternSyntax: {
                                extendedRegExp: true,
                            },
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                            'Beta only',
                        ],
                    },
                );
            });
        });

        it('uses ignoreCase', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'ALPHA',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            ignoreCase: true,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                            'alpha two',
                            'alphabet soup',
                        ],
                    },
                );
            });
        });

        it('uses inverted normal output', async () => {
            await withGrepFixture(async ({otherFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: otherFilePath,
                        },
                        {
                            invertMatch: true,
                        },
                    ),
                    {
                        [otherFilePath]: [
                            'Gamma one',
                            'beta other',
                            'no target here',
                        ],
                    },
                );
            });
        });

        it('uses word regular expression matching', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'alpha',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            ignoreCase: true,
                            matchType: {
                                wordRegExp: true,
                            },
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                            'alpha two',
                        ],
                    },
                );
            });
        });

        it('uses line regular expression matching', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'line-exact',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            matchType: {
                                lineRegExp: true,
                            },
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'line-exact',
                        ],
                    },
                );
            });
        });

        it('counts matches per file and omits zero-count files', async () => {
            await withGrepFixture(async ({notesFilePath, otherFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            files: [
                                notesFilePath,
                                otherFilePath,
                            ],
                        },
                        {
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {
                        [notesFilePath]: 1,
                        [otherFilePath]: 1,
                    },
                );
            });
        });

        it('uses grep count output for unambiguous count-only searches', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                const writtenOutput: string[] = [];
                const restoreWrite = process.stdout.write.bind(process.stdout);

                process.stdout.write = ((chunk: string | Uint8Array) => {
                    writtenOutput.push(String(chunk));

                    return true;
                }) satisfies typeof process.stdout.write as typeof process.stdout.write;

                try {
                    assert.deepEquals(
                        await grep(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                output: {
                                    countOnly: true,
                                },
                                printCommand: true,
                            },
                        ),
                        {
                            [notesFilePath]: 1,
                        },
                    );

                    assert.isTrue(writtenOutput.join('').includes("'--count'"));
                } finally {
                    process.stdout.write =
                        restoreWrite satisfies typeof process.stdout.write as typeof process.stdout.write;
                }
            });
        });

        it('counts matches in files with count-like names', async () => {
            await withGrepFixture(async ({testDir}) => {
                const countLikeFilePath = join(testDir, 'count:123\nname.txt');

                await writeFile(countLikeFilePath, 'Alpha count-like\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: countLikeFilePath,
                        },
                        {
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {
                        [countLikeFilePath]: 1,
                    },
                );
            });
        });

        it('counts matches in files with newlines in their names', async () => {
            await withGrepFixture(async ({newlineFilePath}) => {
                await writeFile(newlineFilePath, 'Alpha newline\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: newlineFilePath,
                        },
                        {
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {
                        [newlineFilePath]: 1,
                    },
                );
            });
        });

        it('counts recursive directory matches in files with newlines in their names', async () => {
            await withGrepFixture(async ({newlineFilePath, testDir}) => {
                await writeFile(newlineFilePath, 'Alpha newline\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha newline',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            output: {
                                countOnly: true,
                            },
                            recursive: true,
                        },
                    ),
                    {
                        [newlineFilePath]: 1,
                    },
                );
            });
        });

        it('counts multiple recursive directory matches in files with newlines in their names', async () => {
            await withGrepFixture(async ({newlineFilePath, testDir}) => {
                const secondNewlineFilePath = join(testDir, 'second\nline.txt');

                await Promise.all([
                    writeFile(newlineFilePath, 'Alpha newline\nAlpha newline again\n'),
                    writeFile(secondNewlineFilePath, 'Alpha newline\n'),
                ]);

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha newline',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            output: {
                                countOnly: true,
                            },
                            recursive: true,
                        },
                    ),
                    {
                        [newlineFilePath]: 2,
                        [secondNewlineFilePath]: 1,
                    },
                );
            });
        });

        it('counts inverted matches', async () => {
            await withGrepFixture(async ({otherFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: otherFilePath,
                        },
                        {
                            invertMatch: true,
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {
                        [otherFilePath]: 3,
                    },
                );
            });
        });

        it('returns files with matches only', async () => {
            await withGrepFixture(async ({notesFilePath, otherFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Gamma',
                        },
                        {
                            files: [
                                notesFilePath,
                                otherFilePath,
                            ],
                        },
                        {
                            output: {
                                filesOnly: true,
                            },
                        },
                    ),
                    {
                        [otherFilePath]: [],
                    },
                );
            });
        });

        it('returns files without matches for inverted files-only output', async () => {
            await withGrepFixture(async ({notesFilePath, otherFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Gamma',
                        },
                        {
                            files: [
                                notesFilePath,
                                otherFilePath,
                            ],
                        },
                        {
                            invertMatch: true,
                            output: {
                                filesOnly: true,
                            },
                        },
                    ),
                    {
                        [notesFilePath]: [],
                    },
                );
            });
        });

        it('limits matches with maxCount', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'alpha',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            ignoreCase: true,
                            maxCount: 2,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                            'alpha two',
                        ],
                    },
                );
            });
        });

        it('stops immediately when maxCount is zero', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            maxCount: 0,
                        },
                    ),
                    {},
                );
            });
        });

        it('counts no matches when maxCount is zero', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            maxCount: 0,
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {},
                );
            });
        });

        it('counts matches in files with colons in their names', async () => {
            await withGrepFixture(async ({colonFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: colonFilePath,
                        },
                        {
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {
                        [colonFilePath]: 1,
                    },
                );
            });
        });

        it('keeps matches from existing files when another requested file is missing', async () => {
            await withGrepFixture(async ({notesFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            files: [
                                join(testDir, 'missing.txt'),
                                notesFilePath,
                            ],
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('preserves leading spaces, trailing spaces, and tabs in matched lines', async () => {
            await withGrepFixture(async ({whitespaceFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'target',
                        },
                        {
                            file: whitespaceFilePath,
                        },
                        {
                            patternSyntax: {
                                fixedStrings: true,
                            },
                        },
                    ),
                    {
                        [whitespaceFilePath]: [
                            '  target leading',
                            'middle target   ',
                            '\t target tab\t',
                        ],
                    },
                );
            });
        });

        it('searches direct directory entries without recursion', async () => {
            await withGrepFixture(
                async ({
                    colonFilePath,
                    dashFilePath,
                    notesFilePath,
                    otherFilePath,
                    spacedFilePath,
                    testDir,
                }) => {
                    assert.deepEquals(
                        await grep(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                dir: testDir,
                            },
                        ),
                        {
                            [dashFilePath]: [
                                'Alpha dash file',
                            ],
                            [colonFilePath]: [
                                'Alpha colon',
                            ],
                            [notesFilePath]: [
                                'Alpha one',
                            ],
                            [otherFilePath]: [
                                'Alpha other',
                            ],
                            [spacedFilePath]: [
                                'Alpha spaced',
                            ],
                        },
                    );
                },
            );
        });

        it('searches multiple directories without recursion', async () => {
            await withGrepFixture(
                async ({
                    colonFilePath,
                    dashFilePath,
                    nestedDirPath,
                    nestedFilePath,
                    notesFilePath,
                    otherFilePath,
                    spacedFilePath,
                    testDir,
                }) => {
                    assert.deepEquals(
                        await grep(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                dirs: [
                                    testDir,
                                    nestedDirPath,
                                ],
                            },
                        ),
                        {
                            [dashFilePath]: [
                                'Alpha dash file',
                            ],
                            [colonFilePath]: [
                                'Alpha colon',
                            ],
                            [notesFilePath]: [
                                'Alpha one',
                            ],
                            [otherFilePath]: [
                                'Alpha other',
                            ],
                            [spacedFilePath]: [
                                'Alpha spaced',
                            ],
                            [nestedFilePath]: [
                                'Alpha nested',
                            ],
                        },
                    );
                },
            );
        });

        it('searches directories recursively', async () => {
            await withGrepFixture(async ({nestedFilePath, notesFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Nested|Alpha one',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            patternSyntax: {
                                extendedRegExp: true,
                            },
                            recursive: true,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                        [nestedFilePath]: [
                            'Nested only',
                        ],
                    },
                );
            });
        });

        it('skips hidden files in direct directory searches', async () => {
            await withGrepFixture(async ({testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha hidden',
                        },
                        {
                            dir: testDir,
                        },
                    ),
                    {},
                );
            });
        });

        it('does not follow symlinked search files by default', async () => {
            await withGrepSymlinkSearchRootFixture(async ({linkedFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: linkedFilePath,
                        },
                    ),
                    {},
                );
            });
        });

        it('follows symlinked search files when requested', async () => {
            await withGrepSymlinkSearchRootFixture(async ({linkedFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: linkedFilePath,
                        },
                        {
                            followSymLinks: true,
                        },
                    ),
                    {
                        [linkedFilePath]: [
                            'Alpha outside',
                        ],
                    },
                );
            });
        });

        it('does not follow symlinked search directories by default', async () => {
            await withGrepSymlinkSearchRootFixture(async ({linkedDirPath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: linkedDirPath,
                        },
                    ),
                    {},
                );
            });
        });

        it('follows symlinked search directories when requested', async () => {
            await withGrepSymlinkSearchRootFixture(async ({linkedDirPath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: linkedDirPath,
                        },
                        {
                            followSymLinks: true,
                        },
                    ),
                    {
                        [join(linkedDirPath, 'outside.txt')]: [
                            'Alpha outside',
                        ],
                    },
                );
            });
        });

        it('does not follow symlinked files in direct directory searches by default', async () => {
            const testDir = await mkdtemp(join(tmpdir(), 'augment-vir-grep-'));
            const searchDirPath = join(testDir, 'search');
            const outsideFilePath = join(testDir, 'outside.txt');
            const linkFilePath = join(searchDirPath, 'linked.txt');

            try {
                await mkdir(searchDirPath);
                await writeFile(outsideFilePath, 'Alpha outside\n');
                await symlink(outsideFilePath, linkFilePath);

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: searchDirPath,
                        },
                    ),
                    {},
                );
            } finally {
                await rm(testDir, {
                    force: true,
                    recursive: true,
                });
            }
        });

        it('follows symlinked files in direct directory searches when requested', async () => {
            const testDir = await mkdtemp(join(tmpdir(), 'augment-vir-grep-'));
            const searchDirPath = join(testDir, 'search');
            const outsideFilePath = join(testDir, 'outside.txt');
            const linkFilePath = join(searchDirPath, 'linked.txt');

            try {
                await mkdir(searchDirPath);
                await writeFile(outsideFilePath, 'Alpha outside\n');
                await symlink(outsideFilePath, linkFilePath);

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: searchDirPath,
                        },
                        {
                            followSymLinks: true,
                        },
                    ),
                    {
                        [linkFilePath]: [
                            'Alpha outside',
                        ],
                    },
                );
            } finally {
                await rm(testDir, {
                    force: true,
                    recursive: true,
                });
            }
        });

        it('includes hidden files in recursive directory searches', async () => {
            await withGrepFixture(async ({hiddenFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha hidden',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            recursive: true,
                        },
                    ),
                    {
                        [hiddenFilePath]: [
                            'Alpha hidden',
                        ],
                    },
                );
            });
        });

        it('does not follow nested symlink directories when recursing by default', async () => {
            await withGrepFixture(async ({nestedFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Nested only',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            recursive: true,
                        },
                    ),
                    {
                        [nestedFilePath]: [
                            'Nested only',
                        ],
                    },
                );
            });
        });

        it('follows nested symlink directories when requested', async () => {
            await withGrepFixture(async ({linkedNestedFilePath, nestedFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Nested only',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            followSymLinks: true,
                            recursive: true,
                        },
                    ),
                    {
                        [nestedFilePath]: [
                            'Nested only',
                        ],
                        [linkedNestedFilePath]: [
                            'Nested only',
                        ],
                    },
                );
            });
        });

        it('searches multiple directories', async () => {
            await withGrepFixture(
                async ({nestedDirPath, nestedFilePath, skippedFilePath, skipDirPath}) => {
                    assert.deepEquals(
                        await grep(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                dirs: [
                                    nestedDirPath,
                                    skipDirPath,
                                ],
                            },
                            {
                                recursive: true,
                            },
                        ),
                        {
                            [nestedFilePath]: [
                                'Alpha nested',
                            ],
                            [skippedFilePath]: [
                                'Alpha skipped',
                            ],
                        },
                    );
                },
            );
        });

        it('excludes directories while searching recursively', async () => {
            await withGrepFixture(
                async ({
                    colonFilePath,
                    dashFilePath,
                    hiddenFilePath,
                    notesFilePath,
                    otherFilePath,
                    spacedFilePath,
                    testDir,
                }) => {
                    assert.deepEquals(
                        await grep(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                dir: testDir,
                            },
                            {
                                excludeDirs: [
                                    'nested',
                                    'skip-dir',
                                ],
                                recursive: true,
                            },
                        ),
                        {
                            [dashFilePath]: [
                                'Alpha dash file',
                            ],
                            [hiddenFilePath]: [
                                'Alpha hidden',
                            ],
                            [colonFilePath]: [
                                'Alpha colon',
                            ],
                            [notesFilePath]: [
                                'Alpha one',
                            ],
                            [otherFilePath]: [
                                'Alpha other',
                            ],
                            [spacedFilePath]: [
                                'Alpha spaced',
                            ],
                        },
                    );
                },
            );
        });

        it('includes only matching file globs without recursion', async () => {
            await withGrepFixture(async ({otherFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            includeFiles: [
                                '*.log',
                            ],
                        },
                    ),
                    {
                        [otherFilePath]: [
                            'Alpha other',
                        ],
                    },
                );
            });
        });

        it('excludes matching file globs without recursion', async () => {
            await withGrepFixture(async ({notesFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            excludePatterns: [
                                '*.log',
                                '*:*',
                                '* *',
                                '-dash-file.txt',
                                'new*',
                            ],
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('can exclude all root files while excluding directories recursively', async () => {
            await withGrepFixture(async ({testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            recursive: true,
                            excludeDirs: [
                                'nested',
                                'skip-dir',
                            ],
                            excludePatterns: [
                                '*',
                            ],
                        },
                    ),
                    {},
                );
            });
        });

        it('includes only matching file globs', async () => {
            await withGrepFixture(async ({notesFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            includeFiles: [
                                'notes.txt',
                            ],
                            recursive: true,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('excludes matching file globs', async () => {
            await withGrepFixture(async ({notesFilePath, otherFilePath, testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: testDir,
                        },
                        {
                            excludeDirs: [
                                'nested',
                                'skip-dir',
                            ],
                            excludePatterns: [
                                '.*',
                                '*.log',
                                'space file.txt',
                                '-dash-file.txt',
                                'colon:name.txt',
                            ],
                            recursive: true,
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: otherFilePath,
                        },
                        {
                            excludePatterns: [
                                '*.log',
                            ],
                        },
                    ),
                    {},
                );
            });
        });

        it('uses cwd with relative file paths', async () => {
            await withGrepFixture(async ({testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: 'notes.txt',
                        },
                        {
                            cwd: testDir,
                        },
                    ),
                    {
                        'notes.txt': [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('handles relative file paths that match object prototype keys', async () => {
            await withGrepFixture(async ({testDir}) => {
                await writeFile(join(testDir, '__proto__'), 'Alpha prototype\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: '__proto__',
                        },
                        {
                            cwd: testDir,
                        },
                    ),
                    {
                        ['__proto__']: [
                            'Alpha prototype',
                        ],
                    },
                );
            });
        });

        it('returns files-only results for relative file paths that match object prototype keys', async () => {
            await withGrepFixture(async ({testDir}) => {
                await writeFile(join(testDir, '__proto__'), 'Alpha prototype\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: '__proto__',
                        },
                        {
                            cwd: testDir,
                            output: {
                                filesOnly: true,
                            },
                        },
                    ),
                    {
                        ['__proto__']: [],
                    },
                );
            });
        });

        it('returns count-only results for relative file paths that match object prototype keys', async () => {
            await withGrepFixture(async ({testDir}) => {
                await writeFile(join(testDir, '__proto__'), 'Alpha prototype\nAlpha again\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: '__proto__',
                        },
                        {
                            cwd: testDir,
                            output: {
                                countOnly: true,
                            },
                        },
                    ),
                    {
                        ['__proto__']: 2,
                    },
                );
            });
        });

        it('returns no matches for process arguments that contain null bytes', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha\0',
                        },
                        {
                            file: notesFilePath,
                        },
                    ),
                    {},
                );
            });
        });

        it('does not run grep for invalid maxCount values', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                const writtenOutput: string[] = [];
                const restoreWrite = process.stdout.write.bind(process.stdout);

                process.stdout.write = ((chunk: string | Uint8Array) => {
                    writtenOutput.push(String(chunk));

                    return true;
                }) satisfies typeof process.stdout.write as typeof process.stdout.write;

                try {
                    assert.deepEquals(
                        await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                maxCount: -2,
                                printCommand: true,
                            },
                        ),
                        {},
                    );

                    assert.isEmpty(writtenOutput);
                } finally {
                    process.stdout.write =
                        restoreWrite satisfies typeof process.stdout.write as typeof process.stdout.write;
                }
            });
        });

        it('returns no matches for malformed runtime search arrays', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    {
                        invalidFiles: await grepWithRuntimeInputs(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                files: notesFilePath,
                            },
                        ),
                        invalidPatterns: await grepWithRuntimeInputs(
                            {
                                patterns: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                        ),
                    },
                    {
                        invalidFiles: {},
                        invalidPatterns: {},
                    },
                );
            });
        });

        it('returns no matches for malformed runtime input objects', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    {
                        invalidLocation: await grepWithRuntimeInputs(
                            {
                                pattern: 'Alpha',
                            },
                            undefined,
                        ),
                        invalidOptions: await grepWithRuntimeInputs(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            null,
                        ),
                        invalidPattern: await grepWithRuntimeInputs(null, {
                            file: notesFilePath,
                        }),
                    },
                    {
                        invalidLocation: {},
                        invalidOptions: {
                            [notesFilePath]: [
                                'Alpha one',
                            ],
                        },
                        invalidPattern: {},
                    },
                );
            });
        });

        it('returns no matches for malformed runtime option arrays', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    await grepWithRuntimeOptions(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: notesFilePath,
                        },
                        {
                            excludeDirs: 'missing',
                            excludePatterns: '*.txt',
                            includeFiles: '*.txt',
                        },
                    ),
                    {},
                );
            });
        });

        it('returns no matches for malformed runtime options', async () => {
            await withGrepFixture(async ({notesFilePath}) => {
                assert.deepEquals(
                    {
                        invalidBoolean: await grepWithRuntimeOptions(
                            {
                                pattern: 'ALPHA',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                ignoreCase: 'true',
                            },
                        ),
                        invalidCwd: await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                cwd: 123,
                            },
                        ),
                        invalidOutput: await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                output: 'countOnly',
                            },
                        ),
                        invalidOutputValue: await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                output: {
                                    countOnly: true,
                                    filesOnly: true,
                                },
                            },
                        ),
                        invalidEmptyOutputValue: await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                output: {},
                            },
                        ),
                        invalidMatchType: await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                matchType: {
                                    wordRegExp: 'true',
                                },
                            },
                        ),
                        invalidEmptyMatchType: await grepWithRuntimeOptions(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                matchType: {},
                            },
                        ),
                        invalidPatternSyntax: await grepWithRuntimeOptions(
                            {
                                pattern: '.*',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                patternSyntax: {
                                    fixedStrings: 'true',
                                },
                            },
                        ),
                        invalidEmptyPatternSyntax: await grepWithRuntimeOptions(
                            {
                                pattern: '.*',
                            },
                            {
                                file: notesFilePath,
                            },
                            {
                                patternSyntax: {},
                            },
                        ),
                    },
                    {
                        invalidBoolean: {},
                        invalidCwd: {},
                        invalidEmptyMatchType: {},
                        invalidEmptyOutputValue: {},
                        invalidEmptyPatternSyntax: {},
                        invalidMatchType: {},
                        invalidOutput: {},
                        invalidOutputValue: {},
                        invalidPatternSyntax: {},
                    },
                );
            });
        });

        it('returns no matches for partial output from a failed grep process', async () => {
            await withGrepFixture(async ({notesFilePath, testDir}) => {
                const unreadableFilePath = join(testDir, 'unreadable.txt');

                await writeFile(unreadableFilePath, 'Alpha unreadable\n');
                await chmod(unreadableFilePath, 0);

                try {
                    assert.deepEquals(
                        await grep(
                            {
                                pattern: 'Alpha',
                            },
                            {
                                files: [
                                    notesFilePath,
                                    unreadableFilePath,
                                ],
                            },
                        ),
                        {},
                    );
                } finally {
                    await chmod(unreadableFilePath, 0o600);
                }
            });
        });

        it('skips named pipe file operands', async () => {
            await withGrepFixture(async ({notesFilePath, testDir}) => {
                const namedPipePath = join(testDir, 'named-pipe');

                await createNamedPipe(namedPipePath);

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            files: [
                                namedPipePath,
                                notesFilePath,
                            ],
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('skips directory file operands', async () => {
            await withGrepFixture(async ({nestedDirPath, notesFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            files: [
                                nestedDirPath,
                                notesFilePath,
                            ],
                        },
                    ),
                    {
                        [notesFilePath]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('skips named pipe directory entries', async () => {
            await withGrepFixture(async ({testDir}) => {
                const namedPipePath = join(testDir, 'named-pipe');

                await createNamedPipe(namedPipePath);

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha one',
                        },
                        {
                            dir: testDir,
                        },
                    ),
                    {
                        [join(testDir, 'notes.txt')]: [
                            'Alpha one',
                        ],
                    },
                );
            });
        });

        it('does not wait on stdin for dash file operands', async () => {
            assert.deepEquals(
                await grep(
                    {
                        pattern: 'Alpha',
                    },
                    {
                        file: '-',
                    },
                ),
                {},
            );
        });

        it('uses cwd with relative directory paths', async () => {
            await withGrepFixture(async ({testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: '.',
                        },
                        {
                            cwd: testDir,
                        },
                    ),
                    {
                        '-dash-file.txt': [
                            'Alpha dash file',
                        ],
                        'colon:name.txt': [
                            'Alpha colon',
                        ],
                        'notes.txt': [
                            'Alpha one',
                        ],
                        'other.log': [
                            'Alpha other',
                        ],
                        'space file.txt': [
                            'Alpha spaced',
                        ],
                    },
                );
            });
        });

        it('handles file paths that contain newlines', async () => {
            await withGrepFixture(async ({newlineFilePath}) => {
                await writeFile(newlineFilePath, 'Alpha newline\n');

                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: newlineFilePath,
                        },
                    ),
                    {
                        [newlineFilePath]: [
                            'Alpha newline',
                        ],
                    },
                );
            });
        });

        it('handles file names that look like options', async () => {
            await withGrepFixture(async ({dashFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: '-dash',
                        },
                        {
                            file: dashFilePath,
                        },
                        {
                            patternSyntax: {
                                fixedStrings: true,
                            },
                        },
                    ),
                    {
                        [dashFilePath]: [
                            '-dash file content',
                        ],
                    },
                );
            });
        });

        it('handles spaces, colons, and apostrophes in inputs', async () => {
            await withGrepFixture(async ({colonFilePath, notesFilePath, spacedFilePath}) => {
                assert.deepEquals(
                    await grep(
                        {
                            patterns: [
                                "quote's pattern",
                                'Alpha',
                            ],
                        },
                        {
                            files: [
                                colonFilePath,
                                notesFilePath,
                                spacedFilePath,
                            ],
                        },
                        {
                            patternSyntax: {
                                fixedStrings: true,
                            },
                        },
                    ),
                    {
                        [colonFilePath]: [
                            'Alpha colon',
                        ],
                        [notesFilePath]: [
                            'Alpha one',
                            "quote's pattern",
                        ],
                        [spacedFilePath]: [
                            'Alpha spaced',
                        ],
                    },
                );
            });
        });

        it('returns no matches for missing files', async () => {
            await withGrepFixture(async ({testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            file: join(testDir, 'missing.txt'),
                        },
                    ),
                    {},
                );
            });
        });

        it('returns no matches for missing directories', async () => {
            await withGrepFixture(async ({testDir}) => {
                assert.deepEquals(
                    await grep(
                        {
                            pattern: 'Alpha',
                        },
                        {
                            dir: join(testDir, 'missing-dir'),
                        },
                    ),
                    {},
                );
            });
        });
    });

    it('does not execute shell substitutions in search patterns', async () => {
        await assertGrepDoesNotCreateSentinel({
            createParams({sentinelFilePath, sourceFilePath}) {
                return {
                    grepSearchLocation: {
                        file: sourceFilePath,
                    },
                    grepSearchPattern: {
                        pattern: `$(touch ${sentinelFilePath})no-match`,
                    },
                    options: {
                        patternSyntax: {
                            fixedStrings: true,
                        },
                    },
                };
            },
        });
    });

    it('does not execute shell substitutions in search locations', async () => {
        await assertGrepDoesNotCreateSentinel({
            createParams({sentinelFilePath, testDir}) {
                return {
                    grepSearchLocation: {
                        file: join(testDir, `$(touch ${sentinelFilePath})missing.txt`),
                    },
                    grepSearchPattern: {
                        pattern: 'safe',
                    },
                };
            },
        });
    });

    it('does not execute shell substitutions in option globs', async () => {
        await assertGrepDoesNotCreateSentinel({
            createParams({sentinelFilePath, testDir}) {
                return {
                    grepSearchLocation: {
                        dir: testDir,
                    },
                    grepSearchPattern: {
                        pattern: 'safe',
                    },
                    options: {
                        excludeDirs: [
                            `$(touch ${sentinelFilePath})excluded-dir`,
                        ],
                        excludePatterns: [
                            `$(touch ${sentinelFilePath})excluded-file`,
                        ],
                        includeFiles: [
                            `$(touch ${sentinelFilePath})included-file`,
                        ],
                        recursive: true,
                    },
                };
            },
        });
    });

    it('does not execute shell substitutions in maxCount', async () => {
        await assertGrepDoesNotCreateSentinel({
            createParams({sentinelFilePath, sourceFilePath}) {
                return {
                    grepSearchLocation: {
                        file: sourceFilePath,
                    },
                    grepSearchPattern: {
                        pattern: 'safe',
                    },
                    options: {
                        maxCount: `$(touch ${sentinelFilePath})1`,
                    },
                };
            },
        });
    });

    it('does not print raw caller inputs in debug output', async () => {
        const testDir = await mkdtemp(join(tmpdir(), 'augment-vir-grep-'));
        const sourceFilePath = join(testDir, 'sensitive-source.txt');
        const sensitiveExcludeDir = 'secret-exclude-dir';
        const sensitiveExcludePattern = 'secret-exclude-pattern';
        const sensitiveIncludeFile = 'secret-include-file';
        const sensitivePattern = 'secret-token-pattern';
        const writtenOutput: string[] = [];
        const restoreWrite = process.stdout.write.bind(process.stdout);

        process.stdout.write = ((chunk: string | Uint8Array) => {
            writtenOutput.push(String(chunk));

            return true;
        }) satisfies typeof process.stdout.write as typeof process.stdout.write;

        try {
            await writeFile(sourceFilePath, 'safe content\n');
            await grep(
                {
                    pattern: sensitivePattern,
                },
                {
                    file: sourceFilePath,
                },
                {
                    printCommand: true,
                    excludeDirs: [
                        sensitiveExcludeDir,
                    ],
                    excludePatterns: [
                        sensitiveExcludePattern,
                    ],
                    includeFiles: [
                        sensitiveIncludeFile,
                    ],
                    maxCount: 1,
                },
            );

            assert.deepEquals(
                {
                    didPrintExcludeDir: writtenOutput.join('').includes(sensitiveExcludeDir),
                    didPrintExcludePattern: writtenOutput
                        .join('')
                        .includes(sensitiveExcludePattern),
                    didPrintIncludeFile: writtenOutput.join('').includes(sensitiveIncludeFile),
                    didPrintPath: writtenOutput.join('').includes(sourceFilePath),
                    didPrintPattern: writtenOutput.join('').includes(sensitivePattern),
                },
                {
                    didPrintExcludeDir: false,
                    didPrintExcludePattern: false,
                    didPrintIncludeFile: false,
                    didPrintPath: false,
                    didPrintPattern: false,
                },
            );
        } finally {
            process.stdout.write =
                restoreWrite satisfies typeof process.stdout.write as typeof process.stdout.write;
            await rm(testDir, {
                force: true,
                recursive: true,
            });
        }
    });
});
