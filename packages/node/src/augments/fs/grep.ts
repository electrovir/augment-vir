import {assert, check} from '@augment-vir/assert';
import {
    arrayToObject,
    getOrSet,
    log,
    safeMatch,
    type PartialWithUndefined,
    type SelectFrom,
} from '@augment-vir/common';
import {join} from 'node:path';
import {type IsEqual, type RequireExactlyOne} from 'type-fest';
import {runShellCommand} from '../terminal/shell.js';

/**
 * Optional options for {@link grep}.
 *
 * @category Internal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type GrepOptions<CountOnly extends boolean = false> = PartialWithUndefined<{
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

function escape(input: string) {
    return input.replaceAll('"', String.raw`\"`).replaceAll('\n', '');
}

/**
 * Output of {@link grep}. Each key is an absolute file path. Values are array of matches lines for
 * that file.
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
    const searchPatterns: string[] = (
        grepSearchPattern.patterns || [grepSearchPattern.pattern]
    ).filter(check.isTruthy);

    if (!searchPatterns.length) {
        return {};
    }

    const searchLocation: SelectFrom<GrepSearchLocation, {files: true; dirs: true}> | undefined =
        grepSearchLocation.files
            ? {
                  files: grepSearchLocation.files,
              }
            : grepSearchLocation.file
              ? {
                    files: [grepSearchLocation.file],
                }
              : grepSearchLocation.dirs
                ? {
                      dirs: grepSearchLocation.dirs,
                  }
                : grepSearchLocation.dir
                  ? {
                        dirs: [grepSearchLocation.dir],
                    }
                  : undefined;

    if (
        !searchLocation ||
        (searchLocation.dirs && !searchLocation.dirs.length) ||
        (searchLocation.files && !searchLocation.files.length)
    ) {
        return {};
    }

    const searchParts = searchLocation.dirs
        ? options.recursive
            ? searchLocation.dirs
            : searchLocation.dirs.map((dir) => join(dir, '*'))
        : searchLocation.files;

    const fullCommand = [
        'grep',
        options.patternSyntax?.basicRegExp
            ? '--basic-regexp'
            : options.patternSyntax?.extendedRegExp
              ? '--extended-regexp'
              : options.patternSyntax?.fixedStrings
                ? '--fixed-strings'
                : '',
        options.ignoreCase ? '--ignore-case' : '',
        options.invertMatch && !options.output?.filesOnly ? '--invert-match' : '',
        options.matchType?.wordRegExp
            ? '--word-regexp'
            : options.matchType?.lineRegExp
              ? '--line-regexp'
              : '',
        options.output?.countOnly
            ? '--count'
            : options.output?.filesOnly
              ? options.invertMatch
                  ? '--files-without-match'
                  : '--files-with-matches'
              : '',
        '--color=never',
        options.maxCount ? `--max-count=${options.maxCount}` : '',
        '--no-messages',
        '--with-filename',
        '--null',
        ...(options.excludePatterns?.length
            ? options.excludePatterns.map(
                  (excludePattern) => `--exclude="${escape(excludePattern)}"`,
              )
            : []),
        options.recursive
            ? options.followSymLinks
                ? '-RS'
                : '--recursive'
            : '',
        ...(options.excludeDirs?.length
            ? options.excludeDirs.map((excludeDir) => `--exclude-dir="${escape(excludeDir)}"`)
            : []),
        ...(options.includeFiles?.length
            ? options.includeFiles.map((includeFile) => `--include="${escape(includeFile)}"`)
            : []),
        options.binary ? '--binary' : '',
        ...searchPatterns.map((searchPattern) => `-e "${searchPattern}"`),
        ...searchParts,
    ]
        .filter(check.isTruthy)
        .join(' ');

    if (options.printCommand) {
        log.faint(`> ${fullCommand}`);
    }

    const result = await runShellCommand(fullCommand, {
        cwd: options.cwd,
    });

    const trimmedOutput = result.stdout.trim();

    if (result.exitCode === 1 || !trimmedOutput) {
        /** No matches. */
        return {};
    } else if (options.output?.countOnly) {
        return arrayToObject(
            trimmedOutput.split(/[\0\n]/),
            (entry) => {
                /** Ignore empty strings. */
                /* node:coverage ignore next 3 */
                if (!entry) {
                    return undefined;
                }

                const [
                    ,
                    fileName,
                    countString,
                ] = safeMatch(entry, /(^.+):(\d+)$/);

                assert.isDefined(fileName, `Failed parse grep file name from: '${entry}'`);

                const count = Number(countString);

                assert.isNumber(count, `Failed to parse grep number from: '${entry}'`);
                if (!count) {
                    return undefined;
                }

                return {
                    key: fileName,
                    value: count,
                };
            },
            {
                useRequired: true,
            },
        ) satisfies Record<string, number> as GrepMatches<CountOnly>;
    } else if (options.output?.filesOnly) {
        return arrayToObject(
            trimmedOutput.split(/[\0\n]/),
            (entry) => {
                /** Ignore empty strings. */
                if (!entry) {
                    return undefined;
                }

                return {
                    key: entry,
                    value: [],
                };
            },
            {
                useRequired: true,
            },
        ) satisfies Record<string, string[]> as GrepMatches<CountOnly>;
    } else {
        const outputLines = trimmedOutput.split(/[\0\n]/);

        const fileMatches: Record<string, string[]> = {};

        outputLines.forEach((line, index) => {
            if (!(index % 2)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                getOrSet(fileMatches, line, () => []).push(outputLines[index + 1]!);
            }
        });

        return fileMatches;
    }
}
