import {assertWrap} from '@augment-vir/assert';
import {camelCaseToKebabCase, sanitizeFilePath, type SelectFrom} from '@augment-vir/common';
import {
    type PlaywrightTestArgs,
    type PlaywrightTestOptions,
    type PlaywrightWorkerArgs,
    type PlaywrightWorkerOptions,
    type TestInfo,
} from '@playwright/test';
import {type TestContext as NodeTestContextImport} from 'node:test';
import {type OmitIndexSignature, type Simplify} from 'type-fest';
import {type MochaNode, type MochaTestContext} from './mocha-types.js';

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
 * The test context for Playwright tests.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type PlaywrightTestContext = SelectFrom<
    PlaywrightTestArgs & PlaywrightTestOptions & PlaywrightWorkerArgs & PlaywrightWorkerOptions,
    {
        page: true;
        baseURL: true;
        browser: true;
        context: true;
        extraHTTPHeaders: true;
        viewport: true;
        video: true;
        userAgent: true;
        timezoneId: true;
        serviceWorkers: true;
        screenshot: true;
        isMobile: true;
        headless: true;
        hasTouch: true;
    }
> & {
    testInfo: TestInfo;
    testName: {
        /** Clean, easily readable for humans. */
        clean: string;
        /** Unique with a random slug appended. */
        unique: string;
    };
};

/**
 * Test context provided by `it`'s callback.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html),
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners, and Playwright's test runner.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type UniversalTestContext = NodeTestContext | MochaTestContext | PlaywrightTestContext;

export enum TestEnv {
    Node = 'node',
    Web = 'web',
    Playwright = 'playwright',
}

/**
 * Test context by the env they run in.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type TestContextByEnv = {
    [TestEnv.Node]: NodeTestContext;
    [TestEnv.Web]: MochaTestContext;
    [TestEnv.Playwright]: PlaywrightTestContext;
};

/**
 * Extracts the full test name (including parent describes) of a given test context. Whether the
 * test be run in web or node tests, the name will be the same.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function extractTestName(testContext: UniversalTestContext): string {
    if (isTestContext(testContext, TestEnv.Node)) {
        return testContext.fullName;
    } else if (isTestContext(testContext, TestEnv.Playwright)) {
        return testContext.testName.clean;
    } else {
        return flattenMochaParentTitles(testContext.test).join(' > ');
    }
}

/**
 * Same as {@link extractTestName} but sanitizes the output so that it's safe for directory names
 * (even on Windows).
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function extractTestNameAsDir(testContext: UniversalTestContext): string {
    return assertWrap.isTruthy(cleanTestNameAsDir(extractTestName(testContext)));
}

/**
 * Same as {@link extractTestNameAsDir} but sanitizes any input in the same way.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function cleanTestNameAsDir(testName: string): string {
    return assertWrap.isTruthy(
        sanitizeFilePath(camelCaseToKebabCase(testName).replaceAll(/[<>:"/\-\\|?*_\s]+/g, '_')),
    );
}

function flattenMochaParentTitles(this: void, node: MochaNode): string[] {
    if (node.root) {
        return [];
    } else {
        return [
            ...flattenMochaParentTitles(node.parent),
            node.title,
        ];
    }
}

/**
 * Asserts that the given context is for the given env and returns that context.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @throws `TypeError` if the context does not match the env.
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function assertWrapTestContext<const SpecificEnv extends TestEnv>(
    this: void,
    context: Readonly<UniversalTestContext>,
    env: SpecificEnv,
): TestContextByEnv[SpecificEnv] {
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
export function assertTestContext<const SpecificEnv extends TestEnv>(
    this: void,
    context: Readonly<UniversalTestContext>,
    env: SpecificEnv,
): asserts context is TestContextByEnv[SpecificEnv] {
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
export function isTestContext<const SpecificEnv extends TestEnv>(
    this: void,
    context: Readonly<UniversalTestContext>,
    env: SpecificEnv,
): context is TestContextByEnv[SpecificEnv] {
    try {
        assertTestContext(context, env);
        return true;
    } catch {
        return false;
    }
}

type NodeOnlyTestContextKeys = Exclude<
    Simplify<keyof NodeTestContext>,
    Simplify<keyof OmitIndexSignature<MochaTestContext>> | Simplify<keyof PlaywrightTestContext>
>;

type PlaywrightOnlyTestContextKeys = Exclude<
    Simplify<keyof PlaywrightTestContext>,
    Simplify<keyof OmitIndexSignature<MochaTestContext>> | Simplify<keyof NodeTestContext>
>;

const nodeOnlyCheckKey = 'diagnostic' satisfies NodeOnlyTestContextKeys;
const playwrightOnlyCheckKey = 'browser' satisfies PlaywrightOnlyTestContextKeys;

/**
 * Determine the env for the given test context.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function determineTestContextEnv(this: void, context: UniversalTestContext): TestEnv {
    if (playwrightOnlyCheckKey in context) {
        return TestEnv.Playwright;
    } else if (nodeOnlyCheckKey in context) {
        return TestEnv.Node;
    } else {
        return TestEnv.Web;
    }
}
