import {
    assertTestContext,
    TestEnv,
    type UniversalTestContext,
} from '../augments/universal-testing-suite/universal-test-context.js';

/**
 * Read from a page's local storage.
 *
 * @category Internal
 */
export async function readLocalStorage(
    testContext: Readonly<UniversalTestContext>,
    storageKey: string,
) {
    assertTestContext(testContext, TestEnv.Playwright);
    return (
        (await testContext.page.evaluate((keyToRead) => {
            return localStorage.getItem(keyToRead);
        }, storageKey)) || undefined
    );
}
