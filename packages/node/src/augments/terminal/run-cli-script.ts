/* node:coverage disable */
/** This file cannot be tested because it calls `process.exit`. */

import {check} from '@augment-vir/assert';
import {dirname, extname} from 'node:path';
import {findNpmBinPath} from '../npm/find-bin-path.js';
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
export const ExtensionToRunner: Record<string, string | {npx: string}> = {
    '.ts': {
        npx: 'tsx',
    },
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
    scriptPath: string,
    /** This should just be `__filename` (for CJS) or `import.meta.filename` (for ESM). */
    cliScriptFilePath: string,
    /**
     * This should be the bin name of the package that is calling this function. Set to `undefined`
     * if there isn't one.
     */
    binName: string | undefined,
) {
    const args = extractRelevantArgs({
        rawArgs: process.argv,
        binName,
        fileName: cliScriptFilePath,
    });

    const extension = extname(scriptPath);

    const runner = ExtensionToRunner[extension];

    if (!runner) {
        throw new Error("No runner configured for file extension '${extension}' in '${path}'");
    }

    const runnerPath = check.isString(runner)
        ? runner
        : findNpmBinPath({
              binName: runner.npx,
              startPath: dirname(cliScriptFilePath),
          }) || runner.npx;

    const results = await runShellCommand(
        interpolationSafeWindowsPath(
            [
                runnerPath,
                scriptPath,
                ...args,
            ].join(' '),
        ),
        {
            hookUpToConsole: true,
        },
    );
    process.exit(results.exitCode || 0);
}
