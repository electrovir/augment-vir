import {assert} from '@augment-vir/assert';
import {existsSync} from 'node:fs';
import {rm} from 'node:fs/promises';
import {describe} from '../augments/universal-testing-suite/universal-describe.js';
import {it} from '../augments/universal-testing-suite/universal-it.js';
import {
    assertTestContext,
    TestEnv,
} from '../augments/universal-testing-suite/universal-test-context.js';
import {
    expectPlaywrightScreenshot,
    getScreenshotPath,
    takeScreenshot,
} from './playwright-screenshot.js';

describe(expectPlaywrightScreenshot.name, () => {
    it('throws on a mismatch even when CI is set', async (testContext) => {
        assertTestContext(testContext, TestEnv.Playwright);

        const screenshotBaseName = 'expect-playwright-screenshot-ci-mismatch';
        const screenshotPath = getScreenshotPath(testContext, screenshotBaseName);

        await testContext.page.setContent(
            '<body style="margin: 0;"><div style="width: 100vw; height: 100vh; background: red;"></div></body>',
        );
        await takeScreenshot(testContext, {
            screenshotBaseName,
        });
        assert.isTrue(existsSync(screenshotPath));

        await testContext.page.setContent(
            '<body style="margin: 0;"><div style="width: 100vw; height: 100vh; background: blue;"></div></body>',
        );

        const originalCi = process.env.CI;
        process.env.CI = 'true';
        try {
            await assert.throws(
                expectPlaywrightScreenshot(testContext, {
                    screenshotBaseName,
                }),
                {
                    matchMessage: 'Screenshot mismatch',
                },
            );
        } finally {
            if (originalCi == undefined) {
                delete process.env.CI;
            } else {
                process.env.CI = originalCi;
            }
            await rm(screenshotPath, {
                force: true,
            });
        }
    });
});
