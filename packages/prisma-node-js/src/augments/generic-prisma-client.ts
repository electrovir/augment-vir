/** This is not completely filled out yet. */
export type GenericPrismaClient = Readonly<
    Record<
        string,
        {
            findFirstOrThrow: () => Promise<any>;
            create: () => Promise<any>;
        }
    >
>;
