import {RuntimeEnv} from '@augment-vir/core';
import {TestContext as NodeTestContextImport} from 'node:test';
import {OmitIndexSignature, Simplify} from 'type-fest';
import type {MochaContext} from '../../mocha-types.js';

/**
 * The test context for [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or
 * other Mocha-style test runners.
 *
 * @category Test : Util
 * @package @augment-vir/test
 */
export type MochaTestContext = MochaContext;
/**
 * The test context for [Node.js's test runner](https://nodejs.org/api/test.html).
 *
 * @category Test : Util
 * @package @augment-vir/test
 */
export type NodeTestContext = NodeTestContextImport;

/**
 * Test context provided by `it`'s callback.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @package @augment-vir/test
 */
export type UniversalContext = NodeTestContext | MochaTestContext;

/**
 * Test context by runtime env when [Node.js's test runner](https://nodejs.org/api/test.html) is
 * used for Node tests and [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) is
 * used for web tests.
 *
 * @category Test : Util
 * @package @augment-vir/test
 */
export type ContextByEnv = {
    [RuntimeEnv.Node]: NodeTestContext;
    [RuntimeEnv.Web]: MochaContext;
};

/**
 * Ensures that the given context is for the given env, otherwise throws an Error.
 *
 * @category Test : Util
 * @package @augment-vir/test
 */
export function ensureTestContext<const SpecificEnv extends RuntimeEnv>(
    context: UniversalContext,
    env: RuntimeEnv,
): ContextByEnv[SpecificEnv] {
    assertTestContext(context, env);

    return context as ContextByEnv[SpecificEnv];
}

/**
 * Asserts that the given context is for the given env, otherwise throws an Error.
 *
 * @category Test : Util
 * @package @augment-vir/test
 */
export function assertTestContext<const SpecificEnv extends RuntimeEnv>(
    context: UniversalContext,
    env: RuntimeEnv,
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
 * @package @augment-vir/test
 */
export function isTestContext<const SpecificEnv extends RuntimeEnv>(
    context: UniversalContext,
    env: RuntimeEnv,
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
 * @package @augment-vir/test
 */
export function determineTestContextEnv(context: UniversalContext): RuntimeEnv {
    return context[nodeOnlyCheckKey] ? RuntimeEnv.Node : RuntimeEnv.Web;
}
