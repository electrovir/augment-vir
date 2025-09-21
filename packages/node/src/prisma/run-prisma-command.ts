/* eslint-disable @typescript-eslint/no-deprecated */

import {log, type PartialWithUndefined, wrapString} from '@augment-vir/common';
import {dirname} from 'node:path';
import {interpolationSafeWindowsPath} from '../augments/path/os-path.js';
import {runShellCommand, type ShellOutput} from '../augments/terminal/shell.js';
import {PrismaSchemaError} from './prisma-errors.js';

/**
 * All commands in the Prisma CLI that support the `--no-hints` flag, used to turn off ads.
 *
 * @category Prisma : Node : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 * @deprecated use the `prisma-vir` package instead.
 */
export const prismaCommandsThatSupportNoHints = ['generate'];

/**
 * Directly run a Prisma command.
 *
 * @category Prisma : Node : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 * @deprecated use the `prisma-vir` package instead.
 */
export async function runPrismaCommand(
    {
        command,
        ignoreExitCode = false,
        hideLogs = false,
    }: {
        command: string;
    } & PartialWithUndefined<{
        /** If `true`, prevents errors from being thrown if this command exits with a non-0 status. */
        ignoreExitCode: boolean;
        hideLogs: boolean;
    }>,
    /** Set to `undefined` to omit the `--schema` flag. */
    schemaFilePath: string | undefined,
    env: Record<string, string> | undefined = {},
) {
    const schemaFileArgs = schemaFilePath
        ? [
              '--schema',
              wrapString({value: schemaFilePath, wrapper: "'"}),
          ]
        : [];

    /** Disable Prisma's in-CLI ads. */
    const noHintsArg = prismaCommandsThatSupportNoHints.some((commandName) =>
        command.startsWith(commandName),
    )
        ? '--no-hints'
        : '';

    const fullCommand = [
        'prisma',
        command,
        ...schemaFileArgs,
        noHintsArg,
    ].join(' ');

    log.faint(`> ${fullCommand}`);

    const result = await runShellCommand(interpolationSafeWindowsPath(fullCommand), {
        env: {
            ...process.env,
            ...env,
        },
        hookUpToConsole: !hideLogs,
        cwd: schemaFilePath ? dirname(schemaFilePath) : process.cwd(),
    });

    return verifyOutput(schemaFilePath || '', result, ignoreExitCode);
}

export function verifyOutput(
    schemaFilePath: string,
    shellOutput: Readonly<ShellOutput>,
    ignoreExitCode: boolean,
) {
    if (shellOutput.stderr.includes('Validation Error Count')) {
        throw new PrismaSchemaError(
            `Invalid schema file at '${schemaFilePath}':\n\n${shellOutput.stderr}`,
        );
    } else if (shellOutput.stderr.includes('does not exist')) {
        throw new PrismaSchemaError(`Database does not exist: ${shellOutput.stderr}`);
    } else if (shellOutput.exitCode === 0 || ignoreExitCode) {
        return shellOutput;
    } else {
        throw new Error(shellOutput.stdout + shellOutput.stderr);
    }
}
