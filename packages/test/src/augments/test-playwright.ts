import {isInsidePlaywrightTest, RuntimeEnvError} from '@augment-vir/core';

export {type MenuOptionOptions} from '../test-playwright/get-option.js';
export {playwrightTeatNameUrlParam, type NavOptions} from '../test-playwright/nav.js';
export {
    type LocatorScreenshotOptions,
    type SaveScreenshotOptions,
    type TakeScreenshotOptions,
} from '../test-playwright/screenshot.js';

async function importPlaywrightTestApi(this: void) {
    if (!isInsidePlaywrightTest()) {
        return new RuntimeEnvError(
            "The 'testPlaywright' api cannot be used outside of a Playwright test context.",
        );
    }

    const {checkHasClass} = await import('../test-playwright/has-class');
    const {enterTextByLabel} = await import('../test-playwright/enter-text');
    const {expectAllVisible} = await import('../test-playwright/all-visible.js');
    const {getMenuOption} = await import('../test-playwright/get-option');
    const {getScreenshotPath, takeScreenshot, expectScreenshot} = await import(
        '../test-playwright/screenshot.js'
    );
    const {handleNewPageOrDownload} = await import('../test-playwright/new-page-or-download');
    const {navigateTo, extractNavUrl} = await import('../test-playwright/nav.js');
    const {readLocalStorage} = await import('../test-playwright/local-storage.js');

    return {
        navigation: {
            /** Navigate to a URL in Playwright via given paths. */
            navigateTo,
            extractNavUrl,
        },
        /**
         * Expects that all matches for the given locator are either visible or hidden (controlled
         * by `isVisible`).
         */
        expectAllVisible,

        /** Clicks a label to select its input and then types the given text. */
        enterTextByLabel,
        /** Find the matching (or first) element with the "option" role. */
        getMenuOption,
        /** Checks if a locator contains the given class. */
        checkHasClass,
        /**
         * Run the trigger and catch a new page _or_ a new download (sometimes Playwright
         * inconsistently chooses on or the other).
         */
        handleNewPageOrDownload,
        /** Read from a page's local storage (using `page.evaluate`). */
        readLocalStorage,

        /** Screenshot methods. */
        screenshot: {
            /**
             * Similar to Playwright's `expect().toHaveScreenshot` but allows images to have
             * different sizes and has default comparison threshold options that are wide enough to
             * allow testing between different operating systems without failure (usually).
             */
            expectScreenshot,
            /** Get the path to save the given screenshot file name to. */
            getScreenshotPath,
            /**
             * Take and immediately save a screenshot.
             *
             * @returns The path that the screenshot was saved to.
             */
            takeScreenshot,
        },
    };
}

/**
 * A suite of Playwright test helpers. This is only accessible within a Playwright test runtime. If
 * accessed outside of a Playwright runtime, it'll be an Error instead of a collection of test
 * helpers.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export const testPlaywright = (await importPlaywrightTestApi()) as Exclude<
    Awaited<ReturnType<typeof importPlaywrightTestApi>>,
    Error
>;
