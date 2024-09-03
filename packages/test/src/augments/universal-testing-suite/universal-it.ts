import {isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import {UniversalContext} from './universal-test-context.js';

/**
 * An interface for an {@link it} callback. Used in {@link UniversalBareIt}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type UniversalItCallback = (this: void, context: UniversalContext) => Promise<void> | void;

/**
 * A minimal interface for {@link it}. This is used in {@link UniversalIt}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type UniversalBareIt = (this: void, doesThis: string, callback: UniversalItCallback) => void;

/**
 * The type for {@link it}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type UniversalIt = UniversalBareIt & {
    only: UniversalBareIt;
    skip: UniversalBareIt;
};

const its = isRuntimeEnv(RuntimeEnv.Node)
    ? {
          node: (await import('node:test')).it,
      }
    : {
          mocha: (globalThis as unknown as {it: UniversalIt}).it,
      };

/**
 * A single test declaration. This can be used in both web tests _and_ node tests, so you only have
 * import from a single place and learn a single interface.
 *
 * This should be nested within a `describe` call. The `it` name should form a sentence fragment
 * that is attached to the parent `describe`'s input. The sentence should ultimately read like this:
 * "myFunction, it does a thing" (as shown in the example below).
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
export const it: UniversalIt = its.mocha || its.node;
