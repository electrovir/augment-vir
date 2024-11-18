/* node:coverage disable */
/** This file cannot be tested because it calls `process.exit`. */

import {extname} from 'node:path';
import {interpolationSafeWindowsPath} from '../path/os-path.js';
import {extractRelevantArgs} from './relevant-args.js';
import {runShellCommand} from './shell.js';

/**
 * A map of file extensions to their known runners for {@link runCliScript}.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export const ExtensionToRunner: Record<string, string> = {
    '.ts': 'tsx',
    '.js': 'node',
    '.sh': 'bash',
};

/**
 * Runs a script path as if it had been run directly, as much as possible.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function runCliScript(
    path: string,
    /**
     * This should be the bin name of the package that is calling this function. Set to `undefined`
     * if there isn't one.
     */
    binName: string | undefined,
) {
    const args = extractRelevantArgs({
        rawArgs: process.argv,
        binName,
        fileName: import.meta.filename,
    });

    const extension = extname(path);

    const runner = ExtensionToRunner[extension];

    if (!runner) {
        throw new Error("No runner configured for file extension '${extension}' in '${path}'");
    }

    const results = await runShellCommand(
        interpolationSafeWindowsPath(
            [
                runner,
                path,
                ...args,
            ].join(' '),
        ),
        {
            hookUpToConsole: true,
        },
    );
    process.exit(results.exitCode || 0);
}
