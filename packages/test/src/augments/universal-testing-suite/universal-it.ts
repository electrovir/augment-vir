import type {it as MochaIt} from 'mocha';
import type {it as NodeIt} from 'node:test';
import {UniversalContext} from './universal-test-context.js';

/**
 * An interface for an `it` callback that is compatible with both Mocha ({@link MochaIt}) and
 * Node.js's built-in test runner ({@link NodeIt}) and used in {@link UniversalIt}.
 *
 * @category Testing:Common
 */
export type UniversalItCallback = (this: void, context: UniversalContext) => Promise<void> | void;

/**
 * An interface for the `it` test function that is compatible with both Mocha ({@link MochaIt}) and
 * Node.js's built-in test runner ({@link NodeIt}). This is used in {@link UniversalIt}. The only
 * difference is that this type does not include `only` and `skip`.
 *
 * @category Testing:Common
 */
export type UniversalBareIt = {
    (this: void, doesThis: string, callback: UniversalItCallback): void;
};

/**
 * A minimal interface for `it` that is compatible with both Mocha ({@link MochaIt}) and Node.js's
 * built-in test runner ({@link NodeIt}). This is used for {@link it}.
 *
 * @category Testing:Common
 */
export type UniversalIt = UniversalBareIt & {
    only: UniversalBareIt;
    skip: UniversalBareIt;
};
