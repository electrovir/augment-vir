import {type MaybePromise} from '@augment-vir/common';
import {type Download, type Page} from '@playwright/test';
import {type RequireExactlyOne} from 'type-fest';
import {
    type UniversalTestContext,
    assertTestContext,
    TestEnv,
} from '../augments/universal-testing-suite/universal-test-context.js';

/**
 * Run the trigger and catch a new page _or_ a new download (sometimes Playwright inconsistently
 * chooses on or the other).
 *
 * @category Internal
 */
export async function handleNewPageOrDownload(
    testContext: Readonly<UniversalTestContext>,
    trigger: () => MaybePromise<void>,
): Promise<
    RequireExactlyOne<{
        newPage: Page;
        download: Download;
    }>
> {
    assertTestContext(testContext, TestEnv.Playwright);
    const openOrDownload = Promise.race([
        testContext.page
            .context()
            .waitForEvent('page')
            .then((result) => {
                return {page: result};
            }),
        testContext.page.waitForEvent('download').then((result) => {
            return {download: result};
        }),
    ]);

    await trigger();

    return (await openOrDownload) satisfies
        | {
              download: Download;
          }
        | {
              page: Page;
          } as RequireExactlyOne<{
        newPage: Page;
        download: Download;
    }>;
}
