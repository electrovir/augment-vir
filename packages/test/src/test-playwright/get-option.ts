import {type Page} from '@playwright/test';

/**
 * Options for `testPlaywright.getMenuOption`.
 *
 * @category Internal
 */
export type MenuOptionOptions = Parameters<Page['getByRole']>[1] &
    Partial<{
        nth: number;
    }>;

/**
 * Find the matching (or first) "option" element.
 *
 * @category Internal
 */
export function getMenuOption(page: Readonly<Page>, options?: MenuOptionOptions | undefined) {
    const baseLocator = page.getByRole('option', options);

    if (options && 'nth' in options) {
        return baseLocator.nth(options.nth);
    } else {
        return baseLocator.first();
    }
}
