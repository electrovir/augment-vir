import {check} from '@augment-vir/assert';
import {omitObjectKeys} from '@augment-vir/common';
import {type GenericTreePaths} from 'spa-router-vir';
import {buildUrl, type UrlOverrides} from 'url-vir';
import {
    assertTestContext,
    assertWrapTestContext,
    extractTestNameAsDir,
    TestEnv,
    type UniversalTestContext,
} from '../augments/universal-testing-suite/universal-test-context.js';

/**
 * Converts {@link NavOptions} into an actionable URL string.
 *
 * @category Internal
 */
export function extractNavUrl(
    testContext: Readonly<UniversalTestContext>,
    options: Readonly<NavOptions>,
): string {
    return buildUrl(
        options.baseFrontendUrl ||
            assertWrapTestContext(testContext, TestEnv.Playwright).page.url(),
        {
            ...omitObjectKeys(options, ['paths']),
            ...(options.paths
                ? check.isArray(options.paths)
                    ? {
                          paths: options.paths,
                      }
                    : {
                          paths: options.paths.fullPaths,
                      }
                : {}),
        },
    ).href;
}

/**
 * Used for the `path` argument of `testPlaywright.nav`.
 *
 * @category Internal
 */
export type NavOptions = Omit<UrlOverrides, 'paths'> & {
    /** If not provided, the page's current URL will be used. */
    baseFrontendUrl?: string | undefined;
    paths?: /** Path array to append to the auto detected frontend url. */
    | string[]
        /** Prefer using tree paths with `frontendPathTree` */
        | GenericTreePaths;
};

/**
 * The test name appended to the frontend when `testPlaywright.nav` is used.
 *
 * @category Internal
 */
export const playwrightTeatNameUrlParam = 'test-name';

/**
 * Navigate to a URL in Playwright via given paths.
 *
 * @category Internal
 */
export async function navigateTo(
    testContext: Readonly<UniversalTestContext>,
    options: Readonly<NavOptions>,
) {
    assertTestContext(testContext, TestEnv.Playwright);
    const page = testContext.page;
    const testName = extractTestNameAsDir(testContext);

    const finalPath = buildUrl(extractNavUrl(testContext, options), {
        search: {
            [playwrightTeatNameUrlParam]: [testName],
        },
    }).href;

    if (page.url() === finalPath) {
        return;
    } else {
        await page.goto(finalPath, {
            waitUntil: 'domcontentloaded',
        });
    }
}
