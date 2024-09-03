import {generatePrismaClient, isGeneratedPrismaClientCurrent} from '../prisma/prisma-client.js';
import {
    doesPrismaDiffExist,
    getPrismaDiff,
    resetDevPrismaDatabase,
} from '../prisma/prisma-database.js';
import {
    applyPrismaMigrationsToDev,
    applyPrismaMigrationsToProd,
    createPrismaMigration,
    getMigrationStatus,
} from '../prisma/prisma-migrations.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {PrismaMigrationNeededError, PrismaResetNeededError} from '../prisma/prisma-errors.js';

export * from '../prisma/prisma-errors.js';
export type {PrismaMigrationStatus} from '../prisma/prisma-migrations.js';

/**
 * Centralized Prisma API from `@augment-vir/node`.
 *
 * ## Prisma flows
 *
 * - Deploy to production
 *
 *   - {@link prisma.migration.applyProd}
 * - Update dev environment
 *
 *   - Apply migrations: {@link prisma.migration.applyDev}
 *
 *       - If throws {@link PrismaMigrationNeededError}, prompt user for a new migration name and pass it to
 *               {@link prisma.migration.create}
 *       - If throws {@link PrismaResetNeededError}, reset the database with {@link prisma.database.resetDev}
 *   - Generate client: `prisma.client.isCurrent`
 *
 *       - If `false`, run {@link prisma.client.generate}
 *
 * @category Prisma : Node
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export const prisma = {
    migration: {
        /**
         * Get current migration status.
         *
         * @see https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-status
         */
        status: getMigrationStatus,
        /**
         * Creates a new migration.
         *
         * @see https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-dev
         */
        create: createPrismaMigration,
        /**
         * Apply all migrations. Meant for a production environment.
         *
         * @see https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-deploy
         */
        applyProd: applyPrismaMigrationsToProd,
        /**
         * Apply all migrations. Meant for a development environment, with less protections than
         * {@link prisma.migration.applyProd}.
         *
         * @throws `PrismaMigrationNeededError` when a new migration is required so the user needs
         *   to input a name.
         * @throws `PrismaResetNeededError` when there's a migration mismatch with the database and
         *   it needs to be reset.
         * @see https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-dev
         */
        applyDev: applyPrismaMigrationsToDev,
    },
    database: {
        /**
         * Force resets a dev database to match the current Prisma schema and migrations.
         *
         * **This will destroy all data. Do not use in production.**
         *
         * @see https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-reset
         */
        resetDev: resetDevPrismaDatabase,
        /**
         * Uses {@link prisma.database.diff} to detect if there are any differences between the
         * current database and the Prisma schema that should control it.
         */
        hasDiff: doesPrismaDiffExist,
        /**
         * Gets a string list of all differences between the current database and the Prisma schema
         * that should control it.
         *
         * @see https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff
         */
        diff: getPrismaDiff,
    },
    client: {
        /**
         * Runs Prisma generators included in the given Prisma schema (which usually includes the
         * Prisma JS client). This will work even if the database doesn't exist yet.
         */
        generate: generatePrismaClient,
        /**
         * Detects if the current generated Prisma JS Client was generated from the current Prisma
         * schema.
         */
        isCurrent: isGeneratedPrismaClientCurrent,
    },
};
