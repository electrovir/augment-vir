// @ts-expect-error: this package's export types are messed up
import {visualDiff} from '@web/test-runner-visual-regression';

export async function testScreenshot(element: Node, screenshotName: string): Promise<void> {
    return await visualDiff(element, screenshotName);
}
