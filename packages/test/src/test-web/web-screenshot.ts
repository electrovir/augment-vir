import {
    getOrSet,
    type PartialWithUndefined,
    randomString,
    type SelectFrom,
} from '@augment-vir/common';
import {
    type CompareScreenshotCommandPayload,
    type CompareScreenshotResult,
    globalElementStoreKey,
    type GlobalThisWithElementStoreKey,
    ScreenshotCommand,
} from '@virmator/test/dist/web-screenshot-plugin/screenshot-payload.js';
import {executeServerCommand} from '@web/test-runner-commands';
import {
    extractTestNameAsDir,
    type UniversalTestContext,
} from '../augments/universal-testing-suite/universal-test-context.js';

export async function assertWebScreenshot(
    element: Element,
    screenshotNameOrTestContext: string | UniversalTestContext,
    options?: Readonly<
        PartialWithUndefined<
            SelectFrom<
                CompareScreenshotCommandPayload,
                {
                    maxDiffPixelRatio: true;
                    threshold: true;
                }
            >
        >
    >,
): Promise<void> {
    if (!element.isConnected) {
        throw new Error('Element must be connected to the DOM.');
    } else if (element.ownerDocument !== document) {
        throw new Error('Element must belong to the same document the tests are run in.');
    }

    const elementKey = randomString();

    getOrSet(globalThis as GlobalThisWithElementStoreKey, globalElementStoreKey, () => {
        return {};
    })[elementKey] = element;

    const screenshotName: string =
        typeof screenshotNameOrTestContext === 'string'
            ? screenshotNameOrTestContext
            : extractTestNameAsDir(screenshotNameOrTestContext);

    const payload: CompareScreenshotCommandPayload = {
        ...options,
        elementKey,
        screenshotFileName: screenshotName,
    };

    const result: CompareScreenshotResult = await executeServerCommand(
        ScreenshotCommand.CompareScreenshot,
        payload,
    );

    if (result.updated) {
        /** Ignore updates. */
        return;
    } else if (!result.passed) {
        throw new Error(
            typeof screenshotNameOrTestContext === 'string'
                ? `Screenshot comparison failed for '${screenshotNameOrTestContext}'`
                : 'Screenshot comparison failed.',
        );
    }
}
