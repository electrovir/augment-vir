import {check} from '@augment-vir/assert';
import {log, safeMatch, toEnsuredNumber} from '@augment-vir/common';
import terminate from 'terminate';
import {runShellCommand} from '../augments/terminal/shell.js';
import {PrismaMigrationNeededError, PrismaResetNeededError} from './prisma-errors.js';
import {runPrismaCommand, verifyOutput} from './run-prisma-command.js';

/**
 * Output of `prisma.migration.status`.
 *
 * @category Prisma : Node : Util
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export type PrismaMigrationStatus = {
    totalMigrations: number;
    unappliedMigrations: string[];
};

export async function applyPrismaMigrationsToProd(
    schemaFilePath: string,
    env: Record<string, string> = {},
) {
    await runPrismaCommand({command: 'migrate deploy'}, schemaFilePath, env);
}

enum DbChangeRequired {
    MigrationNeeded = 'migration-needed',
    ResetNeeded = 'reset-needed',
}

export async function applyPrismaMigrationsToDev(
    schemaFilePath: string,
    env: Record<string, string> = {},
) {
    const command = [
        'prisma',
        'migrate',
        'dev',
        `--schema='${schemaFilePath}'`,
    ].join(' ');

    log.faint(`> ${command}`);

    let dbRequirement = undefined as DbChangeRequired | undefined;

    const result = await runShellCommand(command, {
        env: {
            ...process.env,
            ...env,
        },
        stdoutCallback(stdout, childProcess) {
            if (stdout.includes('Enter a name for the new migration')) {
                if (childProcess.pid) {
                    terminate(childProcess.pid);
                }
                dbRequirement = DbChangeRequired.MigrationNeeded;
            }
        },
        stderrCallback(stderr, childProcess) {
            if (
                stderr.includes(
                    'Prisma Migrate has detected that the environment is non-interactive, which is not supported',
                )
            ) {
                if (childProcess.pid) {
                    terminate(childProcess.pid);
                }
                dbRequirement = DbChangeRequired.ResetNeeded;
            }
        },
    });

    if (dbRequirement === DbChangeRequired.MigrationNeeded) {
        throw new PrismaMigrationNeededError(schemaFilePath);
    } else if (dbRequirement === DbChangeRequired.ResetNeeded) {
        throw new PrismaResetNeededError(schemaFilePath);
    }
    verifyOutput(schemaFilePath, result, false);
}

export async function getMigrationStatus(
    schemaFilePath: string,
    env: Record<string, string> = {},
): Promise<PrismaMigrationStatus> {
    const output = await runPrismaCommand(
        {
            command: 'migrate status',
            ignoreExitCode: true,
        },
        schemaFilePath,
        env,
    );

    const listedMigrations: PrismaMigrationStatus = {
        totalMigrations: 0,
        unappliedMigrations: [],
    };

    let foundNotAppliedMigrations = false;

    output.stdout.split('\n').some((rawLine) => {
        const line = rawLine.trim();
        if (foundNotAppliedMigrations) {
            if (line) {
                listedMigrations.unappliedMigrations.push(line);
            } else {
                /** We're done parsing. */
                return true;
            }
        } else if (line.endsWith('not yet been applied:')) {
            foundNotAppliedMigrations = true;
        } else {
            const [
                ,
                countMatch,
            ] = safeMatch(line, /^([\d,]+) migrations? found in/);

            if (countMatch) {
                listedMigrations.totalMigrations = toEnsuredNumber(countMatch);
            }
        }

        /** Still need to keep parsing. */
        return false;
    });

    return listedMigrations;
}

export async function createPrismaMigration(
    {
        migrationName,
        createOnly = false,
    }: {
        migrationName: string;
        /**
         * Set this to `true` to create a new migration without applying it to the database.
         *
         * @default false
         */
        createOnly?: boolean | undefined;
    },
    schemaFilePath: string,
    env: Record<string, string> = {},
) {
    const command = [
        'migrate',
        'dev',
        `--name='${migrationName}'`,
        createOnly ? '--create-only' : '',
    ]
        .filter(check.isTruthy)
        .join(' ');

    await runPrismaCommand({command}, schemaFilePath, env);
}
