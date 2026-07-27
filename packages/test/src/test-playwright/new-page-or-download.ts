import {type MaybePromise, type RequireExactlyOne} from '@augment-vir/common';
import {type Download, type Page} from '@playwright/test';
import {
    type UniversalTestContext,
    assertTestContext,
    TestEnv,
} from '../augments/universal-testing-suite/universal-test-context.js';

/**
 * Output from {@link handleNewPageOrDownload}.
 *
 * @category Internal
 */
export type HandleNewPageOrDownloadResult = RequireExactlyOne<{
    newPage: Page;
    download: Download;
}>;

/**
 * Run the trigger and catch a new page _or_ a new download (sometimes Playwright inconsistently
 * chooses on or the other).
 *
 * @category Internal
 */
export async function handleNewPageOrDownload(
    testContext: Readonly<UniversalTestContext>,
    trigger: () => MaybePromise<void>,
): Promise<HandleNewPageOrDownloadResult> {
    assertTestContext(testContext, TestEnv.Playwright);
    const openOrDownload: Promise<HandleNewPageOrDownloadResult> = Promise.race([
        testContext.page
            .context()
            .waitForEvent('page')
            .then((result) => {
                return {
                    newPage: result,
                };
            }),
        testContext.page.waitForEvent('download').then((result) => {
            return {
                download: result,
            };
        }),
    ]);

    await trigger();

    return await openOrDownload;
}
