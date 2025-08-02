import {type AnyFunction, type AnyObject} from '@augment-vir/core';

/**
 * Base Prisma client type that all `PrismaClient` instances should be able to match, with enough
 * data that it'll omit random accidental objects.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type BasePrismaClient = {
    $connect: AnyFunction;
    $disconnect: AnyFunction;
    $executeRaw: AnyFunction;
    $executeRawUnsafe: AnyFunction;
    $extends: AnyFunction;
    $on: AnyFunction;
    $queryRaw: AnyFunction;
    $queryRawUnsafe: AnyFunction;
    $transaction: AnyFunction;
} & {[ModelName in string]: any};

/**
 * Base Prisma.TypeMap type.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type BaseTypeMap = {
    model: Record<
        string,
        {
            payload: {
                scalars: AnyObject;
                objects: AnyObject;
            };
        }
    >;
};
