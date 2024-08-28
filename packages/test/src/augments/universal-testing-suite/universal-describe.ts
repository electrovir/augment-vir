import {isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';

/**
 * A minimal interface for `describe` that is compatible with both Mocha and Node.js's built-in test
 * runner. This is used for {@link describe}.
 *
 * @category Testing:Common
 */
export type UniversalDescribe = UniversalBareDescribe & {
    only: UniversalBareDescribe;
    skip: UniversalBareDescribe;
};

/**
 * An interface for the `describe` test function that is compatible with both Mocha and Node.js's
 * built-in test runner. This is used in {@link UniversalDescribe}. The only difference is that this
 * type does not include `only` and `skip`.
 *
 * @category Testing:Common
 */
export type UniversalBareDescribe = (
    this: void,
    describeThis: string,
    callback: (this: void) => void,
) => void;

const describes = isRuntimeEnv(RuntimeEnv.Node)
    ? {
          node: (await import('node:test')).describe,
      }
    : {
          mocha: (globalThis as unknown as {describe: UniversalDescribe}).describe,
      };

export const describe = describes.mocha || describes.node;
