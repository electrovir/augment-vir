import {randomString} from '@augment-vir/common';
import {isInsidePlaywrightTest, isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import {type MochaTestContext} from './mocha-types.js';
import {type PlaywrightTestContext, type UniversalTestContext} from './universal-test-context.js';

/**
 * An interface for an {@link it} callback. Used in {@link UniversalBareIt}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type UniversalItCallback = (
    this: void,
    context: Readonly<UniversalTestContext>,
) => Promise<void> | void;

/**
 * A minimal interface for {@link it}. This is used in {@link UniversalIt}.
 *
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
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
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type UniversalIt = UniversalBareIt & {
    only: UniversalBareIt;
    skip: UniversalBareIt;
};

function createWebIt(): UniversalIt {
    const webIt = Object.assign(
        (doesThis: string, callback: UniversalItCallback) => {
            return (globalThis as unknown as {it: UniversalIt}).it(doesThis, async function () {
                const context = this as unknown as MochaTestContext;
                await callback(context);
            });
        },
        {
            skip: (doesThis: string, callback: UniversalItCallback) => {
                return (globalThis as unknown as {it: UniversalIt}).it.skip(
                    doesThis,
                    async function () {
                        const context = this as unknown as MochaTestContext;
                        await callback(context);
                    },
                );
            },
            only: (doesThis: string, callback: UniversalItCallback) => {
                return (globalThis as unknown as {it: UniversalIt}).it.only(
                    doesThis,
                    async function () {
                        const context = this as unknown as MochaTestContext;
                        await callback(context);
                    },
                );
            },
        },
    );

    return webIt;
}

async function createPlaywrightIt(): Promise<UniversalIt> {
    const {test: originalPlaywrightIt} = await import('@playwright/test');

    /**
     * Right now this wrapper nukes Playwright's file detection. See
     * https://github.com/microsoft/playwright/issues/23157#issuecomment-1574955057 for possible
     * help.
     */
    const playwrightIt = Object.assign(
        (doesThis: string, callback: UniversalItCallback) => {
            return originalPlaywrightIt(
                doesThis,
                async (
                    {
                        page,
                        baseURL,
                        browser,
                        context,
                        extraHTTPHeaders,
                        viewport,
                        video,
                        userAgent,
                        timezoneId,
                        serviceWorkers,
                        screenshot,
                        isMobile,
                        headless,
                        hasTouch,
                    },
                    testInfo,
                ) => {
                    const playwrightTestContext: PlaywrightTestContext = {
                        page,
                        baseURL,
                        browser,
                        context,
                        extraHTTPHeaders,
                        viewport,
                        video,
                        userAgent,
                        timezoneId,
                        serviceWorkers,
                        screenshot,
                        isMobile,
                        headless,
                        hasTouch,
                        testInfo,
                        testName: {
                            clean: testInfo.titlePath.join(' > '),
                            unique: [
                                ...testInfo.titlePath,
                                randomString(),
                            ].join(' > '),
                        },
                    };
                    await callback(playwrightTestContext);
                },
            );
        },
        {
            skip: (doesThis: string, callback: UniversalItCallback) => {
                return originalPlaywrightIt.skip(
                    doesThis,
                    async (
                        {
                            page,
                            baseURL,
                            browser,
                            context,
                            extraHTTPHeaders,
                            viewport,
                            video,
                            userAgent,
                            timezoneId,
                            serviceWorkers,
                            screenshot,
                            isMobile,
                            headless,
                            hasTouch,
                        },
                        testInfo,
                    ) => {
                        const playwrightTestContext: PlaywrightTestContext = {
                            page,
                            baseURL,
                            browser,
                            context,
                            extraHTTPHeaders,
                            viewport,
                            video,
                            userAgent,
                            timezoneId,
                            serviceWorkers,
                            screenshot,
                            isMobile,
                            headless,
                            hasTouch,
                            testInfo,
                            testName: {
                                clean: testInfo.titlePath.join(' > '),
                                unique: [
                                    ...testInfo.titlePath,
                                    randomString(),
                                ].join(' > '),
                            },
                        };
                        await callback(playwrightTestContext);
                    },
                );
            },
            only: (doesThis: string, callback: UniversalItCallback) => {
                return originalPlaywrightIt.only(
                    doesThis,
                    async (
                        {
                            page,
                            baseURL,
                            browser,
                            context,
                            extraHTTPHeaders,
                            viewport,
                            video,
                            userAgent,
                            timezoneId,
                            serviceWorkers,
                            screenshot,
                            isMobile,
                            headless,
                            hasTouch,
                        },
                        testInfo,
                    ) => {
                        const playwrightTestContext: PlaywrightTestContext = {
                            page,
                            baseURL,
                            browser,
                            context,
                            extraHTTPHeaders,
                            viewport,
                            video,
                            userAgent,
                            timezoneId,
                            serviceWorkers,
                            screenshot,
                            isMobile,
                            headless,
                            hasTouch,
                            testInfo,
                            testName: {
                                clean: testInfo.titlePath.join(' > '),
                                unique: [
                                    ...testInfo.titlePath,
                                    randomString(),
                                ].join(' > '),
                            },
                        };
                        await callback(playwrightTestContext);
                    },
                );
            },
        },
    );

    return playwrightIt;
}

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
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export const it: UniversalIt = isRuntimeEnv(RuntimeEnv.Node)
    ? isInsidePlaywrightTest()
        ? await createPlaywrightIt()
        : (await import('node:test')).it
    : createWebIt();
