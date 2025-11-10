import {type Page} from '@playwright/test';
import {
    type UniversalTestContext,
    assertTestContext,
    TestEnv,
} from '../augments/universal-testing-suite/universal-test-context.js';

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
export function getMenuOption(
    testContext: Readonly<UniversalTestContext>,
    options?: MenuOptionOptions | undefined,
) {
    assertTestContext(testContext, TestEnv.Playwright);
    const baseLocator = testContext.page.getByRole('option', options);

    if (options && 'nth' in options) {
        return baseLocator.nth(options.nth);
    } else {
        return baseLocator.first();
    }
}
