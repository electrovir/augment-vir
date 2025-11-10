import {type Page} from '@playwright/test';

/**
 * Read from a page's local storage.
 *
 * @category Internal
 */
export async function readLocalStorage(page: Readonly<Page>, storageKey: string) {
    return (
        (await page.evaluate((keyToRead) => {
            return localStorage.getItem(keyToRead);
        }, storageKey)) || undefined
    );
}
