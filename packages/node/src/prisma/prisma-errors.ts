export class PrismaSchemaError extends Error {
    public override readonly name = 'PrismaSchemaError';
    constructor(message: string) {
        super(message);
    }
}

export class PrismaMigrationNeededError extends Error {
    public override readonly name = 'PrismaMigrationNeededError';
    constructor(schemaFilePath: string) {
        super(`A new Prisma migration is needed for '${schemaFilePath}'`);
    }
}

export class PrismaResetNeededError extends Error {
    public override readonly name = 'PrismaResetNeededError';
    constructor(schemaFilePath: string) {
        super(`A database reset is needed for '${schemaFilePath}'`);
    }
}
