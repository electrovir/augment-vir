/**
 * An error thrown by the Prisma API that indicates that something is wrong with the given Prisma
 * schema. See the error message for more details.
 *
 * @category Prisma : Node : Util
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export class PrismaSchemaError extends Error {
    public override readonly name = 'PrismaSchemaError';
    constructor(message: string) {
        super(message);
    }
}

/**
 * An error thrown by the Prisma API that indicates that applying migrations in dev failed such that
 * a new migration is needed. You can do that by prompting user for a new migration name and passing
 * it to `prisma.migration.create`.
 *
 * @category Prisma : Node : Util
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export class PrismaMigrationNeededError extends Error {
    public override readonly name = 'PrismaMigrationNeededError';
    constructor(schemaFilePath: string) {
        super(`A new Prisma migration is needed for '${schemaFilePath}'`);
    }
}

/**
 * An error thrown by the Prisma API that indicates that applying migrations in dev failed such that
 * the entire database needs to be reset. You can do that by calling `prisma.database.resetDev`.
 *
 * @category Prisma : Node : Util
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export class PrismaResetNeededError extends Error {
    public override readonly name = 'PrismaResetNeededError';
    constructor(schemaFilePath: string) {
        super(`A database reset is needed for '${schemaFilePath}'`);
    }
}
