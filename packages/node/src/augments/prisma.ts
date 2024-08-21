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

/** Centralized Prisma API from `@augment-vir/node`. */
export const prisma = {
    migration: {
        status: getMigrationStatus,
        create: createPrismaMigration,
        applyProd: applyPrismaMigrationsToProd,
        applyDev: applyPrismaMigrationsToDev,
    },
    database: {
        resetDev: resetDevPrismaDatabase,
        hasDiff: doesPrismaDiffExist,
        diff: getPrismaDiff,
    },
    client: {
        generate: generatePrismaClient,
        isCurrent: isGeneratedPrismaClientCurrent,
    },
};
