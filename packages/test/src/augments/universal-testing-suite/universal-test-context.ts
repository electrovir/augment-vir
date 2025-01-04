import {RuntimeEnv} from '@augment-vir/core';
import {type TestContext as NodeTestContextImport} from 'node:test';
import {type OmitIndexSignature, type Simplify} from 'type-fest';
import {type MochaTestContext} from './mocha-types.js';

export {RuntimeEnv} from '@augment-vir/core';

/**
 * The test context for [Node.js's test runner](https://nodejs.org/api/test.html).
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type NodeTestContext = Readonly<NodeTestContextImport> & {
    /** Added for use by `assertSnapshot`. */
    snapshotCount?: {[TestName in string]: number};
};

/**
 * Test context provided by `it`'s callback.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type UniversalTestContext = NodeTestContext | MochaTestContext;

/**
 * Test context by runtime env when [Node.js's test runner](https://nodejs.org/api/test.html) is
 * used for Node tests and [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) is
 * used for web tests.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type ContextByEnv = {
    [RuntimeEnv.Node]: NodeTestContext;
    [RuntimeEnv.Web]: MochaTestContext;
};

/**
 * Asserts that the given context is for the given env and returns that context.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @throws `TypeError` if the context does not match the env.
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function assertWrapTestContext<const SpecificEnv extends RuntimeEnv>(
    this: void,
    context: UniversalTestContext,
    env: SpecificEnv,
): ContextByEnv[SpecificEnv] {
    assertTestContext(context, env);

    return context;
}

/**
 * Asserts that the given context is for the given env, otherwise throws an Error.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function assertTestContext<const SpecificEnv extends RuntimeEnv>(
    this: void,
    context: UniversalTestContext,
    env: SpecificEnv,
): asserts context is ContextByEnv[SpecificEnv] {
    const actualEnv = determineTestContextEnv(context);

    if (actualEnv !== env) {
        throw new TypeError(`Provided test context is not for the expected env '${env}'.`);
    }
}

/**
 * Checks that the given context is for the given env.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function isTestContext<const SpecificEnv extends RuntimeEnv>(
    this: void,
    context: UniversalTestContext,
    env: SpecificEnv,
): context is ContextByEnv[SpecificEnv] {
    try {
        assertTestContext(context, env);
        return true;
    } catch {
        return false;
    }
}

type NodeOnlyTestContextKeys = Exclude<
    Simplify<keyof NodeTestContext>,
    Simplify<keyof OmitIndexSignature<MochaTestContext>>
>;

const nodeOnlyCheckKey = 'diagnostic' satisfies NodeOnlyTestContextKeys;

/**
 * Determine the env for the given test context.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function determineTestContextEnv(this: void, context: UniversalTestContext): RuntimeEnv {
    return nodeOnlyCheckKey in context ? RuntimeEnv.Node : RuntimeEnv.Web;
}
