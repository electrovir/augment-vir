import {isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';

/**
 * A minimal interface for {@link describe}. This is used in {@link UniversalDescribe}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type UniversalBareDescribe = (
    this: void,
    describeThis: string,
    callback: (this: void) => void,
) => void;

/**
 * The type for {@link describe}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type UniversalDescribe = UniversalBareDescribe & {
    only: UniversalBareDescribe;
    skip: UniversalBareDescribe;
};

const describes = isRuntimeEnv(RuntimeEnv.Node)
    ? {
          node: (await import('node:test')).describe,
      }
    : {
          mocha: (globalThis as unknown as {describe: UniversalDescribe}).describe,
      };

/**
 * A test suite declaration. This can be used in both web tests _and_ node tests, so you only have
 * import from a single place and learn a single interface.
 *
 * This should be passed a _noun_ (preferably a single word, when possible) of what is going to be
 * tested inside the test suite. Its callback should call `it` from this same package.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @example
 *
 * ```ts
 * import {describe, it} from '@augment-vir/test';
 *
 * describe(myFunction.name, () => {
 *     it('does a thing', () => {
 *         myFunction();
 *     });
 * });
 * ```
 *
 * @package @augment-vir/test
 */
export const describe = describes.mocha || describes.node;
