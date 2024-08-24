import {isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import type {it as nodeIt} from 'node:test';
import type {it as mochaIt} from '../../mocha.js';
import {UniversalContext} from './universal-test-context.js';

/**
 * An interface for an `it` callback that is compatible with both Mocha ({@link mochaIt}) and
 * Node.js's built-in test runner ({@link nodeIt}) and used in {@link UniversalIt}.
 *
 * @category Testing:Common
 */
export type UniversalItCallback = (this: void, context: UniversalContext) => Promise<void> | void;

/**
 * An interface for the `it` test function that is compatible with both Mocha ({@link mochaIt}) and
 * Node.js's built-in test runner ({@link nodeIt}). This is used in {@link UniversalIt}. The only
 * difference is that this type does not include `only` and `skip`.
 *
 * @category Testing:Common
 */
export type UniversalBareIt = (this: void, doesThis: string, callback: UniversalItCallback) => void;

/**
 * A minimal interface for `it` that is compatible with both Mocha ({@link mochaIt}) and Node.js's
 * built-in test runner ({@link nodeIt}). This is used for {@link it}.
 *
 * @category Testing:Common
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
          mocha: (globalThis as unknown as {it: typeof mochaIt}).it,
      };

export const it: UniversalIt = (its.mocha || its.node) as UniversalIt;
