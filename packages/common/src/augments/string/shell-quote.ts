/**
 * Wraps a string in single quotes so that a POSIX shell treats it as a single literal argument.
 * Single quotes disable word splitting, glob expansion, and command substitution, so the shell
 * passes the value through exactly as given. The only character that cannot appear inside single
 * quotes is a single quote itself, which is closed, escaped, and reopened.
 *
 * This is only valid for POSIX shells like `bash`. It is not correct for `cmd.exe`, which uses
 * entirely different quoting rules.
 *
 * This protects a single round of shell parsing. If the command string will be parsed twice (bash
 * hands it to something that parses it again), quoting once is not enough; see
 * `interpolationSafeWindowsPath` in `@augment-vir/node`, whose backslash count assumes two rounds.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {shellQuote} from '@augment-vir/common';
 *
 * shellQuote('hello world'); // outputs `"'hello world'"`
 * shellQuote("it's"); // outputs `"'it'\\''s'"`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function shellQuote(input: string) {
    return [
        "'",
        input.replaceAll("'", String.raw`'\''`),
        "'",
    ].join('');
}
