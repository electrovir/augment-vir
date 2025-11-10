import {check} from '@augment-vir/assert';
import {type GenericTreePaths} from 'spa-router-vir';
import {buildUrl} from 'url-vir';
import {
    assertTestContext,
    extractTestNameAsDir,
    TestEnv,
    type UniversalTestContext,
} from '../augments/universal-testing-suite/universal-test-context.js';

function extractNavUrl(frontendUrl: string, path: NavPath) {
    return check.isString(path)
        ? path
        : check.isArray(path)
          ? buildUrl(frontendUrl, {
                paths: path,
            }).href
          : buildUrl(frontendUrl, {
                paths: path.fullPaths,
            }).href;
}

/**
 * Used for the `path` argument of `testPlaywright.nav`.
 *
 * @category Internal
 */
export type NavPath =
    | /** A full URL to load, will not be appended to the auto detected frontend url. */
    string
    /** Path array to append to the auto detected frontend url. */
    | string[]
    /** Prefer using tree paths with `frontendPathTree` */
    | GenericTreePaths;

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
export async function nav(
    testContext: UniversalTestContext,
    {
        path,
        baseFrontendUrl,
    }: {
        path: NavPath;
        /** If not provided, the page's current URL will be used. */
        baseFrontendUrl?: string | undefined;
    },
) {
    assertTestContext(testContext, TestEnv.Playwright);
    const page = testContext.page;
    const testName = extractTestNameAsDir(testContext);

    const finalPath = buildUrl(extractNavUrl(baseFrontendUrl || page.url(), path), {
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
