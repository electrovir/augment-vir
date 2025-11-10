import {type Page} from '@playwright/test';

/**
 * Clicks a label to select its input and then types the given text.
 *
 * @category Internal
 */
export async function enterTextByLabel(
    page: Readonly<Page>,
    {label, text}: {label: string; text: string},
) {
    await page.getByLabel(label).first().click();
    await page.keyboard.type(text);
}
