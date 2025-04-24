/**
 * These types have all been deduced from local testing, as Mocha's types aren't accurate. Only
 * properties that make sense are included. (Lots of actual properties on these types are
 * misleadingly named. Those have been omitted.)
 */

import {type AnyFunction} from '@augment-vir/common';

/**
 * Any Mocha context node inside {@link MochaTestContext}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type MochaNode = MochaSuite | MochaTest | MochaRoot;

/**
 * The root context inside {@link MochaTestContext}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type MochaRoot = {
    title: '';
    root: true;
};

/**
 * An individual test suite inside {@link MochaTestContext}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type MochaSuite = {
    title: string;
    root: false;
    ctx: {test: MochaTest};
    suites: MochaSuite[];
    tests: MochaSuite[];
    parent: MochaNode;
};

/**
 * An individual test context inside {@link MochaTestContext}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type MochaTest = {
    type: 'test';
    /** The current test name. */
    title: string;
    /** The current test callback. */
    fn: AnyFunction;
    id: string;
    parent: MochaNode;
    ctx: {test: MochaTest};
    root?: undefined;
};

/**
 * The test context for [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or
 * other Mocha-style test runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type MochaTestContext = Readonly<{
    test: MochaTest;
}> & {
    /** Added for use by `assertSnapshot`. */
    snapshotCount?: {[TestName in string]: number};
};
