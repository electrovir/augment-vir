import {
    type UniversalTestContext,
    assertTestContext,
    TestEnv,
} from '../augments/universal-testing-suite/universal-test-context.js';

/**
 * Clicks a label to select its input and then types the given text.
 *
 * @category Internal
 */
export async function enterTextByLabel(
    testContext: Readonly<UniversalTestContext>,
    {label, text}: {label: string; text: string},
) {
    assertTestContext(testContext, TestEnv.Playwright);
    await testContext.page.getByLabel(label).first().click();
    await testContext.page.keyboard.type(text);
}
