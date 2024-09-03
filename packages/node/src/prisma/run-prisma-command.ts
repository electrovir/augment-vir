import {log} from '@augment-vir/common';
import {runShellCommand, type ShellOutput} from '../augments/terminal/shell.js';
import {PrismaSchemaError} from './prisma-errors.js';

const prismaCommandsThatSupportNoHints = [
    'generate',
];

export async function runPrismaCommand(
    {
        command,
        ignoreExitCode = false,
    }: {
        command: string;
        ignoreExitCode?: boolean | undefined;
    },
    /** Set to `undefined` to omit the `--schema` flag. */
    schemaFilePath: string | undefined,
    env: Record<string, string> | undefined = {},
) {
    const schemaFileArgs = schemaFilePath
        ? [
              '--schema',
              schemaFilePath,
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

    const result = await runShellCommand(fullCommand, {
        env: {
            ...process.env,
            ...env,
        },
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
    } else if (shellOutput.stderr.includes('does not exist at')) {
        throw new PrismaSchemaError(`Database does not exist: ${shellOutput.stderr}`);
    } else if (shellOutput.exitCode === 0 || ignoreExitCode) {
        return shellOutput;
    } else {
        throw new Error(shellOutput.stdout + shellOutput.stderr);
    }
}
