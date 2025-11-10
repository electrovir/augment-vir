import {type MaybePromise} from '@augment-vir/common';
import {type Download, type Page} from '@playwright/test';
import {type RequireExactlyOne} from 'type-fest';

/**
 * Run the trigger and catch a new page _or_ a new download (sometimes Playwright inconsistently
 * chooses on or the other).
 *
 * @category Internal
 */
export async function handleNewPageOrDownload(
    page: Readonly<Page>,
    trigger: () => MaybePromise<void>,
): Promise<
    RequireExactlyOne<{
        newPage: Page;
        download: Download;
    }>
> {
    const openOrDownload = Promise.race([
        page
            .context()
            .waitForEvent('page', async (newPage) => {
                return (await newPage.opener()) === page;
            })
            .then((result) => {
                return {page: result};
            }),
        page.waitForEvent('download').then((result) => {
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
