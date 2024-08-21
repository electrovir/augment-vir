# @augment-vir/node

## Prisma flows

-   deploy to production
    -   `prisma.migration.applyProd`
-   update dev environment
    -   apply migrations: `prisma.migration.applyDev`
        -   if throws `PrismaMigrationNeededError`, prompt user for a new migration name
            -   pass migration name to `prisma.migration.create`
        -   if throws `PrismaResetNeededError`, reset the database with `prisma.database.resetDev`
    -   generate client: `prisma.client.isCurrent`
        -   if `false`, run `prisma.client.generate`
