export type PrismaDatabase = {
    databaseName: string;
    schemaFilePath: string;
    generatedPrismaClientDirPath: string;

    env: Record<string, string>;
    cwd: string;
};
