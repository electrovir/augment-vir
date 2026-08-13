import {assert, check} from '@augment-vir/assert';
import {
    awaitedBlockingMap,
    getObjectTypedKeys,
    log,
    shellQuote,
    typedObjectFromEntries,
    type IsEqual,
    type PartialWithUndefined,
    type RequireExactlyOne,
    type SelectFrom,
} from '@augment-vir/common';
import {spawn} from 'node:child_process';
import {lstat, readdir, stat} from 'node:fs/promises';
import {isAbsolute, join, resolve} from 'node:path';
import {isOperatingSystem, OperatingSystem} from '../os/operating-system.js';

/**
 * Optional options for {@link grep}.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type GrepOptions<CountOnly extends boolean = false> = PartialWithUndefined<{
    /* node:coverage ignore next */
    patternSyntax: RequireExactlyOne<{
        /**
         * -E, --extended-regexp: Interpret PATTERNS as extended regular expressions (EREs, see
         * below).
         */
        extendedRegExp: true;
        /** -F, --fixed-strings: Interpret PATTERNS as fixed strings, not regular expressions. */
        fixedStrings: true;
        /**
         * -G, --basic-regexp: Interpret PATTERNS as basic regular expressions (BREs, see below).
         * This is the default.
         */
        basicRegExp: true;
    }>;
    /**
     * If set to true, sets: -i, --ignore-case: Ignore case distinctions in patterns and input data,
     * so that characters that differ only in case match each other.
     */
    ignoreCase: boolean;
    /** -v, --invert-match: Invert the sense of matching, to select non-matching lines. */
    invertMatch: boolean;
    matchType: RequireExactlyOne<{
        /**
         * -w, --word-regexp: Select only those lines containing matches that form whole words. The
         * test is that the matching substring must either be at the beginning of the line, or
         * preceded by a non-word constituent character. Similarly, it must be either at the end of
         * the line or followed by a non-word constituent character. Word-constituent characters are
         * letters, digits, and the underscore. This option has no effect if -x is also specified.
         */
        wordRegExp: true;
        /**
         * -x, --line-regexp: Select only those matches that exactly match the whole line. For a
         * regular expression pattern, this is like parenthesizing the pattern and then surrounding
         * it with ^ and $.
         */
        lineRegExp: true;
    }>;

    output: RequireExactlyOne<{
        /**
         * -c, --count: Suppress normal output; instead print a count of matching lines for each
         * input file. With the -v, --invert-match option (see above), count non-matching lines.
         */
        countOnly: CountOnly;
        /**
         * -l, --files-with-matches: Suppress normal output; instead print the name of each input
         * file from which output would normally have been printed. Scanning each input file stops
         * upon first match.
         */
        filesOnly: true;
    }>;

    /**
     * --exclude=GLOB: Skip any command-line file with a name suffix that matches the pattern GLOB,
     * using wildcard matching; a name suffix is either the whole name, or a trailing part that
     * starts with a non-slash character immediately after a slash (/) in the name. When searching
     * recursively, skip any subfile whose base name matches GLOB; the base name is the part after
     * the last slash. A pattern can use *, ?, and [...] as wildcards, and \ to quote a wildcard or
     * backslash character literally.
     */
    excludePatterns: string[];

    /**
     * -m NUM, --max-count=NUM: Stop reading a file after NUM matching lines. If NUM is zero, grep
     * stops right away without reading input. A NUM of -1 is treated as infinity and grep does not
     * stop; this is the default. If the input is standard input from a regular file, and NUM
     * matching lines are output, grep ensures that the standard input is positioned to just after
     * the last matching line before exiting, regardless of the presence of trailing context lines.
     * This enables a calling process to resume a search. When grep stops after NUM matching lines,
     * it outputs any trailing context lines. When the -c or --count option is also used, grep does
     * not output a count greater than NUM. When the -v or --invert-match option is also used, grep
     * stops after outputting NUM non-matching lines.
     */
    maxCount: number;
    /**
     * -r, --recursive: Read all files under each directory, recursively, following symbolic links
     * only if they are on the command line. Note that if no file operand is given, grep searches
     * the working directory. This is equivalent to the -d recurse option.
     */
    recursive: boolean;
    /**
     * If `true`, sets `--dereference-recursive` instead of `--recursive` when searching
     * recursively.
     *
     * -R, --dereference-recursive: Read all files under each directory, recursively. Follow all
     * symbolic links, unlike -r.
     */
    followSymLinks: boolean;
    /**
     * -U, --binary: Treat the file(s) as binary. By default, under MS-DOS and MS-Windows, grep
     * guesses whether a file is text or binary as described for the --binary-files option. If grep
     * decides the file is a text file, it strips the CR characters from the original file contents
     * (to make regular expressions with ^ and $ work correctly). Specifying -U overrules this
     * guesswork, causing all files to be read and passed to the matching mechanism verbatim; if the
     * file is a text file with CR/LF pairs at the end of each line, this will cause some regular
     * expressions to fail. This option has no effect on platforms other than MS-DOS and MS-
     * Windows.
     */
    binary: boolean;
    /**
     * --exclude-dir=GLOB: Skip any command-line directory with a name suffix that matches the
     * pattern GLOB. When searching recursively, skip any subdirectory whose base name matches GLOB.
     * Ignore any redundant trailing slashes in GLOB.
     */
    excludeDirs: string[];
    /**
     * --include=GLOB: Search only files whose base name matches GLOB (using wildcard matching as
     * described under --exclude). If contradictory --include and --exclude options are given, the
     * last matching one wins. If no --include or --exclude options match, a file is included unless
     * the first such option is --include.
     */
    includeFiles: string[];
    /** Debugging option: if set to `true`, the grep CLI command will be printed before execution. */
    printCommand: boolean;
    /** The directory where the grep command where be run within. */
    cwd: string;
}>;

/**
 * Search location options for {@link grep}.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type GrepSearchLocation = RequireExactlyOne<{
    /** Search within multiple files. */
    files: string[];
    /**
     * Search within multiple directories. Set `recursive` to `true` in options to search the
     * directory recursively.
     */
    dirs: string[];

    /**
     * Search within a single directory. Set `recursive` to `true` in options to search the
     * directory recursively.
     */
    dir: string;
    /** Search within a single file. */
    file: string;
}>;

/**
 * Search pattern options for {@link grep}.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type GrepSearchPattern = RequireExactlyOne<{
    pattern: string;
    patterns: string[];
}>;

const grepBinPath = '/usr/bin/grep';

function recursiveFlag({
    recursive,
    followSymLinks,
}: Readonly<Pick<GrepOptions, 'recursive' | 'followSymLinks'>>): string {
    if (!recursive) {
        return '';
    } else if (followSymLinks) {
        /**
         * BSD `grep` (macOS) requires `-S` to follow symlinks while recursing, but GNU `grep`
         * (Linux) has no `-S` flag and instead follows all symlinks with `-R`. Only one of these
         * branches can run on a given operating system.
         */
        /* node:coverage ignore next */
        return isOperatingSystem(OperatingSystem.Mac) ? '-RS' : '-R';
    } else {
        return '--recursive';
    }
}

function isValidMaxCount(maxCount: unknown) {
    return (
        maxCount == undefined ||
        (check.isNumber(maxCount) && Number.isInteger(maxCount) && maxCount >= -1)
    );
}

function isOptionalBoolean(input: unknown) {
    return input == undefined || check.isBoolean(input);
}

function isValidTrueOnlyOptionGroup({
    input,
    values,
}: Readonly<{
    input: unknown;
    values: ReadonlyArray<unknown>;
}>) {
    return (
        input == undefined ||
        (check.isObject(input) &&
            values.every((value) => value == undefined || value === true) &&
            values.filter((value) => value === true).length === 1)
    );
}

function isValidPatternSyntax(input: unknown) {
    return isValidTrueOnlyOptionGroup({
        input,
        values: check.isObject(input)
            ? [
                  input.basicRegExp,
                  input.extendedRegExp,
                  input.fixedStrings,
              ]
            : [],
    });
}

function isValidMatchType(input: unknown) {
    return isValidTrueOnlyOptionGroup({
        input,
        values: check.isObject(input)
            ? [
                  input.lineRegExp,
                  input.wordRegExp,
              ]
            : [],
    });
}

function isValidOutput(input: unknown) {
    return isValidTrueOnlyOptionGroup({
        input,
        values: check.isObject(input)
            ? [
                  input.countOnly,
                  input.filesOnly,
              ]
            : [],
    });
}

type GrepCommandOutput = {
    exitCode: number | undefined;
    stdout: string;
};

function didGrepFail({exitCode}: Readonly<GrepCommandOutput>) {
    return exitCode == undefined || exitCode > 1;
}

function spawnGrepProcess({
    args,
    cwd,
}: Readonly<{
    args: string[];
    cwd: string | undefined;
}>) {
    try {
        return spawn(grepBinPath, args, {
            cwd,
            stdio: [
                'ignore',
                'pipe',
                'pipe',
            ],
        });
        /* node:coverage ignore next 3 */
    } catch {
        return undefined;
    }
}

async function runGrepCommand({
    args,
    cwd,
}: Readonly<{
    args: string[];
    cwd: string | undefined;
}>): Promise<GrepCommandOutput> {
    return new Promise<GrepCommandOutput>((resolveOutput) => {
        const stdoutChunks: Buffer[] = [];
        const grepProcess = spawnGrepProcess({
            args,
            cwd,
        });

        if (!grepProcess) {
            resolveOutput({
                exitCode: undefined,
                stdout: '',
            });
            return;
        }

        assert.isDefined(grepProcess.stdout, 'stdout emitter was not created for grep.');
        assert.isDefined(grepProcess.stderr, 'stderr emitter was not created for grep.');

        grepProcess.stdout.on('data', (chunk) => {
            stdoutChunks.push(Buffer.from(chunk));
        });
        grepProcess.stderr.on('data', () => {});
        /* node:coverage ignore next 5 */
        grepProcess.on('error', () => {
            resolveOutput({
                exitCode: undefined,
                stdout: Buffer.concat(stdoutChunks).toString(),
            });
        });
        grepProcess.on('close', (rawExitCode) => {
            resolveOutput({
                /* node:coverage ignore next */
                exitCode: rawExitCode ?? undefined,
                stdout: Buffer.concat(stdoutChunks).toString(),
            });
        });
    });
}

function redactGrepArgForLogging({
    arg,
    index,
    operandDelimiterIndex,
    previousArg,
}: Readonly<{
    arg: string;
    index: number;
    operandDelimiterIndex: number;
    previousArg: string | undefined;
}>) {
    if (previousArg === '-e') {
        return '<pattern>';
    } else if (operandDelimiterIndex >= 0 && index > operandDelimiterIndex) {
        return '<path>';
    } else if (arg.startsWith('--exclude-dir=')) {
        return '--exclude-dir=<glob>';
    } else if (arg.startsWith('--exclude=')) {
        return '--exclude=<glob>';
    } else if (arg.startsWith('--include=')) {
        return '--include=<glob>';
    } else if (arg.startsWith('--max-count=')) {
        return '--max-count=<count>';
    } else {
        return arg;
    }
}

function formatGrepCommand(args: ReadonlyArray<string>) {
    const operandDelimiterIndex = args.indexOf('--');

    return [
        'grep',
        ...args.map((arg, index) => {
            return shellQuote(
                redactGrepArgForLogging({
                    arg,
                    index,
                    operandDelimiterIndex,
                    previousArg: args[index - 1],
                }),
            );
        }),
    ].join(' ');
}

function replaceGrepCountOutputArg({
    args,
    replacement,
}: Readonly<{
    args: ReadonlyArray<string>;
    replacement: string;
}>) {
    const countArgIndex = args.indexOf('--count');

    /* node:coverage ignore next */
    return countArgIndex < 0 ? [...args] : args.toSpliced(countArgIndex, 1, replacement);
}

function replaceGrepSearchOperands({
    args,
    searchParts,
}: Readonly<{
    args: ReadonlyArray<string>;
    searchParts: ReadonlyArray<string>;
}>) {
    const operandDelimiterIndex = args.indexOf('--');

    return [
        ...args.slice(0, operandDelimiterIndex + 1),
        ...searchParts,
    ];
}

function extractStringArray(input: unknown) {
    return check.isArray(input) ? input.filter(check.isString).filter(check.isTruthy) : [];
}

function extractOptionalStringArray(input: unknown) {
    if (input == undefined) {
        return [];
    } else if (!check.isArray(input) || !input.every(check.isString)) {
        return undefined;
    } else {
        return input.filter(check.isTruthy);
    }
}

function extractString(input: unknown) {
    return check.isString(input) && input ? input : undefined;
}

function extractGrepOptionArrays({
    excludeDirs,
    excludePatterns,
    includeFiles,
}: Readonly<
    PartialWithUndefined<{
        excludeDirs: unknown;
        excludePatterns: unknown;
        includeFiles: unknown;
    }>
>) {
    const extractedExcludeDirs = extractOptionalStringArray(excludeDirs);
    const extractedExcludePatterns = extractOptionalStringArray(excludePatterns);
    const extractedIncludeFiles = extractOptionalStringArray(includeFiles);

    return extractedExcludeDirs && extractedExcludePatterns && extractedIncludeFiles
        ? {
              excludeDirs: extractedExcludeDirs,
              excludePatterns: extractedExcludePatterns,
              includeFiles: extractedIncludeFiles,
          }
        : undefined;
}

function areGrepOptionsValid<const CountOnly extends boolean>({
    grepOptions,
}: Readonly<{
    grepOptions: Readonly<Partial<GrepOptions<CountOnly>>>;
}>) {
    return (
        isValidMaxCount(grepOptions.maxCount) &&
        (grepOptions.cwd == undefined || !!extractString(grepOptions.cwd)) &&
        [
            grepOptions.binary,
            grepOptions.followSymLinks,
            grepOptions.ignoreCase,
            grepOptions.invertMatch,
            grepOptions.printCommand,
            grepOptions.recursive,
        ].every(isOptionalBoolean) &&
        isValidPatternSyntax(grepOptions.patternSyntax) &&
        isValidMatchType(grepOptions.matchType) &&
        isValidOutput(grepOptions.output)
    );
}

function createSearchPatterns(grepSearchPattern: Readonly<GrepSearchPattern> | undefined) {
    if (!check.isObject(grepSearchPattern)) {
        return [];
    }

    const rawPatterns: unknown[] = check.isArray(grepSearchPattern.patterns)
        ? grepSearchPattern.patterns
        : [
              grepSearchPattern.pattern,
          ];

    return extractStringArray(rawPatterns);
}

function createSearchLocation(
    grepSearchLocation: Readonly<GrepSearchLocation> | undefined,
): SelectFrom<GrepSearchLocation, {files: true; dirs: true}> | undefined {
    if (!check.isObject(grepSearchLocation)) {
        return undefined;
    }

    const file = extractString(grepSearchLocation.file);
    const dir = extractString(grepSearchLocation.dir);

    if (grepSearchLocation.files != undefined) {
        return {
            files: extractStringArray(grepSearchLocation.files),
        };
    } else if (file) {
        return {
            files: [
                file,
            ],
        };
    } else if (grepSearchLocation.dirs == undefined) {
        return dir
            ? {
                  dirs: [
                      dir,
                  ],
              }
            : undefined;
    } else {
        return {
            dirs: extractStringArray(grepSearchLocation.dirs),
        };
    }
}

function resolveSearchPart({
    cwd,
    searchPart,
}: Readonly<{
    cwd: string | undefined;
    searchPart: string;
}>) {
    return cwd && !isAbsolute(searchPart) ? resolve(cwd, searchPart) : searchPart;
}

async function shouldSearchPart({
    cwd,
    followSymLinks,
    includeDirectories,
    searchPart,
}: Readonly<{
    cwd: string | undefined;
    followSymLinks: boolean | undefined;
    includeDirectories: boolean;
    searchPart: string;
}>) {
    try {
        const fileStats = await (followSymLinks ? stat : lstat)(
            resolveSearchPart({
                cwd,
                searchPart,
            }),
        );

        return fileStats.isFile() || (includeDirectories && fileStats.isDirectory());
    } catch {
        return false;
    }
}

async function filterSearchParts({
    cwd,
    followSymLinks,
    includeDirectories,
    searchParts,
}: Readonly<{
    cwd: string | undefined;
    followSymLinks: boolean | undefined;
    includeDirectories: boolean;
    searchParts: ReadonlyArray<string>;
}>) {
    return (
        await awaitedBlockingMap(searchParts, async (searchPart) => {
            return (await shouldSearchPart({
                cwd,
                followSymLinks,
                includeDirectories,
                searchPart,
            }))
                ? searchPart
                : undefined;
        })
    ).filter(check.isTruthy);
}

async function readDirectDirSearchParts({
    cwd,
    dir,
    followSymLinks,
}: Readonly<{
    cwd: string | undefined;
    dir: string;
    followSymLinks: boolean | undefined;
}>) {
    try {
        const readDirPath = resolveSearchPart({
            cwd,
            searchPart: dir,
        });

        return (
            await awaitedBlockingMap(
                (await readdir(readDirPath)).toSorted().filter((entry) => !entry.startsWith('.')),
                async (entry) => {
                    const searchPart = join(dir, entry);

                    return (await shouldSearchPart({
                        cwd: readDirPath,
                        followSymLinks,
                        includeDirectories: false,
                        searchPart: entry,
                    }))
                        ? searchPart
                        : undefined;
                },
            )
        ).filter(check.isTruthy);
        /* node:coverage ignore next 3 */
    } catch {
        return [];
    }
}

async function createSearchParts({
    cwd,
    followSymLinks,
    recursive,
    searchLocation,
}: Readonly<{
    cwd: string | undefined;
    followSymLinks: boolean | undefined;
    recursive: boolean | undefined;
    searchLocation: SelectFrom<GrepSearchLocation, {files: true; dirs: true}>;
}>) {
    const searchParts = searchLocation.dirs || searchLocation.files;
    assert.isDefined(searchParts, 'Grep search location was not resolved.');

    const filteredSearchParts = await filterSearchParts({
        cwd,
        followSymLinks,
        includeDirectories: !!searchLocation.dirs,
        searchParts,
    });

    return searchLocation.dirs
        ? recursive
            ? filteredSearchParts
            : (
                  await awaitedBlockingMap(filteredSearchParts, (dir) => {
                      return readDirectDirSearchParts({
                          cwd,
                          dir,
                          followSymLinks,
                      });
                  })
              ).flat()
        : filteredSearchParts;
}

type GrepCountEntryParams = {
    countString: string | undefined;
    fileName: string | undefined;
};

type NullDelimitedGrepRecord = {
    fileName: string;
    value: string;
};

function createGrepCountEntry({countString, fileName}: Readonly<GrepCountEntryParams>) {
    assert.isDefined(fileName, 'Failed parse grep file name.');

    const count = Number(countString);

    assert.isNumber(count, `Failed to parse grep number from: '${countString}'`);
    /* node:coverage ignore next 3 */
    if (!count) {
        return undefined;
    }

    return {
        key: fileName,
        value: count,
    };
}

function parseNullDelimitedGrepRecords({stdout}: Readonly<{stdout: string}>) {
    const records: NullDelimitedGrepRecord[] = [];
    let recordStartIndex = 0;

    while (recordStartIndex < stdout.length) {
        const delimiterIndex = stdout.indexOf('\0', recordStartIndex);

        /* node:coverage ignore next 3 */
        if (delimiterIndex < 0) {
            break;
        }

        const valueStartIndex = delimiterIndex + 1;
        const newlineIndex = stdout.indexOf('\n', valueStartIndex);
        /* node:coverage ignore next */
        const valueEndIndex = newlineIndex < 0 ? stdout.length : newlineIndex;

        records.push({
            fileName: stdout.slice(recordStartIndex, delimiterIndex),
            value: stdout.slice(valueStartIndex, valueEndIndex),
        });

        /* node:coverage ignore next */
        recordStartIndex = newlineIndex < 0 ? stdout.length : newlineIndex + 1;
    }

    return records;
}

/* node:coverage ignore next 28 */
function parseColonDelimitedGrepCountOutput(stdout: string) {
    return typedObjectFromEntries(
        stdout
            .trimEnd()
            .split('\n')
            .map((entry) => {
                if (!entry) {
                    return undefined;
                }

                const countDelimiterIndex = entry.lastIndexOf(':');

                return createGrepCountEntry({
                    countString:
                        countDelimiterIndex < 0 ? undefined : entry.slice(countDelimiterIndex + 1),
                    fileName:
                        countDelimiterIndex < 0 ? undefined : entry.slice(0, countDelimiterIndex),
                });
            })
            .filter(check.isTruthy)
            .map((entry) => {
                return [
                    entry.key,
                    entry.value,
                ];
            }),
    );
}

/* node:coverage ignore next 22 */
function parseGrepCountOutput(stdout: string) {
    return stdout.includes('\0')
        ? typedObjectFromEntries(
              parseNullDelimitedGrepRecords({
                  stdout,
              })
                  .map((record) => {
                      return createGrepCountEntry({
                          countString: record.value,
                          fileName: record.fileName,
                      });
                  })
                  .filter(check.isTruthy)
                  .map((entry) => {
                      return [
                          entry.key,
                          entry.value,
                      ];
                  }),
          )
        : parseColonDelimitedGrepCountOutput(stdout);
}

/* node:coverage ignore next 7 */
function tryParseGrepCountOutput(stdout: string) {
    try {
        return parseGrepCountOutput(stdout);
    } catch {
        return undefined;
    }
}

function parseKnownFileCountOutput({
    filePath,
    stdout,
}: Readonly<{
    filePath: string;
    stdout: string;
}>) {
    /* node:coverage ignore next 3 */
    if (stdout.includes('\0')) {
        return parseGrepCountOutput(stdout)[filePath];
    }

    const countPrefix = `${filePath}:`;
    /* node:coverage ignore next */
    const outputLine = stdout.endsWith('\n') ? stdout.slice(0, -1) : stdout;

    /* node:coverage ignore next 3 */
    if (!outputLine.startsWith(countPrefix)) {
        return undefined;
    }

    /* node:coverage ignore next */
    return createGrepCountEntry({
        countString: outputLine.slice(countPrefix.length),
        fileName: filePath,
    })?.value;
}

async function runKnownFileGrepCount({
    cwd,
    filePath,
    grepArgs,
}: Readonly<{
    cwd: string | undefined;
    filePath: string;
    grepArgs: ReadonlyArray<string>;
}>) {
    const result = await runGrepCommand({
        args: replaceGrepSearchOperands({
            args: grepArgs,
            searchParts: [
                filePath,
            ],
        }),
        cwd,
    });

    /* node:coverage ignore next 3 */
    if (didGrepFail(result)) {
        return undefined;
    }

    const count = parseKnownFileCountOutput({
        filePath,
        stdout: result.stdout,
    });

    /* node:coverage ignore next 3 */
    if (!count) {
        return undefined;
    }

    return {
        key: filePath,
        value: count,
    };
}

async function runGrepCountFallback({
    cwd,
    grepArgs,
}: Readonly<{
    cwd: string | undefined;
    grepArgs: ReadonlyArray<string>;
}>) {
    const filesOnlyResult = await runGrepCommand({
        args: replaceGrepCountOutputArg({
            args: grepArgs,
            replacement: '--files-with-matches',
        }),
        cwd,
    });

    /* node:coverage ignore next 3 */
    if (didGrepFail(filesOnlyResult) || filesOnlyResult.exitCode === 1 || !filesOnlyResult.stdout) {
        return {};
    }

    return typedObjectFromEntries(
        (
            await awaitedBlockingMap(
                getObjectTypedKeys(parseGrepFilesOnlyOutput(filesOnlyResult.stdout)),
                (filePath) => {
                    return runKnownFileGrepCount({
                        cwd,
                        filePath,
                        grepArgs,
                    });
                },
            )
        )
            .filter(check.isTruthy)
            .map((entry) => {
                return [
                    entry.key,
                    entry.value,
                ];
            }),
    );
}

function parseGrepFilesOnlyOutput(stdout: string) {
    return typedObjectFromEntries(
        /* node:coverage ignore next */
        (stdout.includes('\0') ? stdout.split('\0') : stdout.trimEnd().split('\n'))
            .filter(check.isTruthy)
            .map((entry) => {
                return [
                    entry,
                    [],
                ];
            }),
    );
}

function parseGrepNormalOutput(stdout: string) {
    const fileMatches = new Map<string, string[]>();

    parseNullDelimitedGrepRecords({
        stdout,
    }).forEach((record) => {
        fileMatches.set(record.fileName, [
            ...(fileMatches.get(record.fileName) || []),
            record.value,
        ]);
    });

    return typedObjectFromEntries([...fileMatches.entries()]);
}

/**
 * Output of {@link grep}. Each key is a file path returned by `grep`. Values are arrays of matched
 * lines for that file.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type GrepMatches<CountOnly extends boolean = false> =
    IsEqual<CountOnly, true> extends true
        ? {[FileName in string]: number}
        : IsEqual<CountOnly, false> extends true
          ? {[FileName in string]: string[]}
          : {[FileName in string]: number} | {[FileName in string]: string[]};

/**
 * Run `grep`, matching patterns to specific lines in files or directories.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function grep<const CountOnly extends boolean = false>(
    grepSearchPattern: Readonly<GrepSearchPattern>,
    grepSearchLocation: Readonly<GrepSearchLocation>,
    options: Readonly<GrepOptions<CountOnly>> = {},
): Promise<GrepMatches<CountOnly>> {
    const grepOptions: Readonly<Partial<GrepOptions<CountOnly>>> = check.isObject(options)
        ? options
        : {};
    const searchPatterns = createSearchPatterns(grepSearchPattern);
    const grepOptionArrays = extractGrepOptionArrays(grepOptions);
    const cwd = extractString(grepOptions.cwd);

    if (
        !searchPatterns.length ||
        !grepOptionArrays ||
        !areGrepOptionsValid({
            grepOptions,
        })
    ) {
        return {};
    }

    const searchLocation = createSearchLocation(grepSearchLocation);

    if (
        !searchLocation ||
        (searchLocation.dirs && !searchLocation.dirs.length) ||
        (searchLocation.files && !searchLocation.files.length)
    ) {
        return {};
    }

    const searchParts = await createSearchParts({
        cwd,
        followSymLinks: grepOptions.followSymLinks,
        recursive: grepOptions.recursive,
        searchLocation,
    });

    if (!searchParts.length) {
        return {};
    }

    const grepArgs = [
        grepOptions.patternSyntax?.basicRegExp
            ? '--basic-regexp'
            : grepOptions.patternSyntax?.extendedRegExp
              ? '--extended-regexp'
              : grepOptions.patternSyntax?.fixedStrings
                ? '--fixed-strings'
                : '',
        grepOptions.ignoreCase ? '--ignore-case' : '',
        grepOptions.invertMatch && !grepOptions.output?.filesOnly ? '--invert-match' : '',
        grepOptions.matchType?.wordRegExp
            ? '--word-regexp'
            : grepOptions.matchType?.lineRegExp
              ? '--line-regexp'
              : '',
        grepOptions.output?.countOnly
            ? '--count'
            : grepOptions.output?.filesOnly
              ? grepOptions.invertMatch
                  ? '--files-without-match'
                  : '--files-with-matches'
              : '',
        '--color=never',
        grepOptions.maxCount == undefined ? '' : `--max-count=${grepOptions.maxCount}`,
        '--no-messages',
        '--devices=skip',
        '--with-filename',
        '--null',
        ...(grepOptionArrays.excludePatterns.length
            ? grepOptionArrays.excludePatterns.map(
                  (excludePattern) => `--exclude=${excludePattern}`,
              )
            : []),
        recursiveFlag(grepOptions),
        ...(grepOptionArrays.excludeDirs.length
            ? grepOptionArrays.excludeDirs.map((excludeDir) => `--exclude-dir=${excludeDir}`)
            : []),
        ...(grepOptionArrays.includeFiles.length
            ? grepOptionArrays.includeFiles.map((includeFile) => `--include=${includeFile}`)
            : []),
        grepOptions.binary ? '--binary' : '',
        ...searchPatterns.flatMap((searchPattern) => {
            return [
                '-e',
                searchPattern,
            ];
        }),
        '--',
        ...searchParts,
    ].filter(check.isTruthy);

    if (grepOptions.printCommand) {
        log.faint(`> ${formatGrepCommand(grepArgs)}`);
    }

    const result = await runGrepCommand({
        args: grepArgs,
        cwd,
    });

    if (didGrepFail(result) || result.exitCode === 1 || !result.stdout) {
        /** No matches. */
        return {};
    } else if (grepOptions.output?.countOnly) {
        /* node:coverage ignore next 4 */
        const parsedCountOutput =
            isOperatingSystem(OperatingSystem.Mac) && !result.stdout.includes('\0')
                ? undefined
                : tryParseGrepCountOutput(result.stdout);

        /* node:coverage ignore next 3 */
        if (parsedCountOutput) {
            return parsedCountOutput satisfies Record<string, number> as GrepMatches<CountOnly>;
        }

        return (await runGrepCountFallback({
            cwd,
            grepArgs,
        })) satisfies Record<string, number> as GrepMatches<CountOnly>;
    } else if (grepOptions.output?.filesOnly) {
        return parseGrepFilesOnlyOutput(result.stdout) satisfies Record<
            string,
            string[]
        > as GrepMatches as GrepMatches<CountOnly>;
    } else {
        return parseGrepNormalOutput(result.stdout) satisfies Record<
            string,
            string[]
        > as GrepMatches<CountOnly>;
    }
}
