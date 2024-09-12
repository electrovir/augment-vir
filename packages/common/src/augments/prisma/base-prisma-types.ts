import {AnyObject, type AnyFunction} from '@augment-vir/core';

/**
 * A base type for Prisma model payloads because Prisma doesn't give us one. This currently only
 * includes the properties that are used within this package.
 *
 * Note: this omits the `composites` property because I don't have any examples of what those
 * actually are.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type BasePrismaPayload = {
    name: string;
    objects: Record<string, BasePrismaPayload | BasePrismaPayload[] | null>;
    scalars: AnyObject;
};

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
