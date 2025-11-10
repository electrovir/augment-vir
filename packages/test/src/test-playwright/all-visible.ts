import {expect, type Locator} from '@playwright/test';

/**
 * Expects that all matches for the given locator are either visible or hidden (controlled by
 * `isVisible`).
 *
 * @category Internal
 */
export async function expectAllVisible(locator: Readonly<Locator>, isVisible: boolean) {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
        if (isVisible) {
            await expect(locator.nth(i)).toBeVisible();
        } else {
            await expect(locator.nth(i)).toBeHidden();
        }
    }
}
