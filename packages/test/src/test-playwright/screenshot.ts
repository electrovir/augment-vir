import {assert} from '@augment-vir/assert';
import {addSuffix, log, type Dimensions, type PartialWithUndefined} from '@augment-vir/common';
import {writeFileAndDir} from '@augment-vir/node';
import {expect, type Locator} from '@playwright/test';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {relative} from 'node:path';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';
import sharp from 'sharp';
import {
    assertTestContext,
    assertWrapTestContext,
    TestEnv,
    type UniversalTestContext,
} from '../augments/universal-testing-suite/universal-test-context.js';

/** This is used for type extraction because Playwright does not export the types we need. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractScreenshotMethod() {
    assert.never('this function should not be executed, it is only used for types');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return expect({} as Locator).toHaveScreenshot;
}

/**
 * Correct options for `locator.screenshot`. (Playwright's `LocatorScreenshotOptions` export is
 * wrong.)
 *
 * @category Internal
 * @default defaultScreenshotOptions
 */
export type LocatorScreenshotOptions = NonNullable<
    Parameters<ReturnType<typeof extractScreenshotMethod>>[0]
>;

/**
 * Default internal options for {@link LocatorScreenshotOptions}, used in {@link expectScreenshot}
 *
 * @category Internal
 */
export const defaultScreenshotOptions = {
    animations: 'disabled',
    caret: 'hide',
    timeout: 10_000,
    scale: 'css',
    threshold: 0.1,
    maxDiffPixelRatio: 0.08,
} satisfies LocatorScreenshotOptions;

async function padImage(image: Buffer, {height, width}: Dimensions) {
    return await sharp({
        create: {width, height, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0}},
    })
        /** Top-left align. */
        .composite([{input: image, left: 0, top: 0}])
        .png()
        .toBuffer();
}

/** Pads both images to the same canvas (max width/height) without scaling. */
async function padToSameCanvas(aBuf: Buffer, bBuf: Buffer) {
    const [
        aMeta,
        bMeta,
    ] = await Promise.all([
        sharp(aBuf).metadata(),
        sharp(bBuf).metadata(),
    ]);
    if (!aMeta.width || !aMeta.height || !bMeta.width || !bMeta.height) {
        throw new Error('Unable to read image dimensions.');
    }
    const dimensions: Readonly<Dimensions> = {
        width: Math.max(aMeta.width, bMeta.width),
        height: Math.max(aMeta.height, bMeta.height),
    };

    const [
        aPadded,
        bPadded,
    ] = await Promise.all([
        padImage(aBuf, dimensions),
        padImage(bBuf, dimensions),
    ]);
    const aPng = PNG.sync.read(aPadded);
    const bPng = PNG.sync.read(bPadded);
    return {
        aPng,
        bPng,
        dimensions,
    };
}

export type TakeScreenshotOptions = PartialWithUndefined<{
    /** If no locator is provided then the whole page is use. */
    locator: Readonly<Locator>;
}> &
    Partial<LocatorScreenshotOptions>;

async function takeScreenshotBuffer(
    testContext: Readonly<UniversalTestContext>,
    options: TakeScreenshotOptions = {},
): Promise<Buffer> {
    if (options.locator) {
        /** The locator expectation has different options than the page expectation. */
        return await options.locator.screenshot({
            ...defaultScreenshotOptions,
            ...options,
        });
    } else {
        assertTestContext(testContext, TestEnv.Playwright);

        return await testContext.page.screenshot({
            ...defaultScreenshotOptions,
            ...options,
        });
    }
}

/** @returns The path that the screenshot was saved to. */
async function saveScreenshotBuffer(
    testContext: Readonly<UniversalTestContext>,
    screenshotBuffer: Buffer,
    screenshotBaseName: string,
): Promise<string> {
    assertTestContext(testContext, TestEnv.Playwright);
    const screenshotPath = getScreenshotPath(testContext, screenshotBaseName);
    await writeFileAndDir(screenshotPath, screenshotBuffer);
    return screenshotPath;
}

/**
 * Get the path to save the given screenshot file name to.
 *
 * @category Internal
 */
export function getScreenshotPath(
    testContext: Readonly<UniversalTestContext>,
    screenshotBaseName: string,
): string {
    assertTestContext(testContext, TestEnv.Playwright);

    const screenshotFileName = addSuffix({value: screenshotBaseName, suffix: '.png'});
    return testContext.testInfo.snapshotPath(screenshotFileName);
}

/**
 * Options for taking _and_ saving a screenshot.
 *
 * @category Internal
 */
export type SaveScreenshotOptions = TakeScreenshotOptions & {
    screenshotBaseName: string;
};

/**
 * Take and immediately save a screenshot.
 *
 * @category Internal
 * @returns The path that the screenshot was saved to.
 */
export async function takeScreenshot(
    testContext: Readonly<UniversalTestContext>,
    options: Readonly<SaveScreenshotOptions>,
): Promise<string> {
    return await saveScreenshotBuffer(
        testContext,
        await takeScreenshotBuffer(testContext, options),
        options.screenshotBaseName,
    );
}

/**
 * Similar to Playwright's `expect().toHaveScreenshot` but allows images to have different sizes and
 * has default comparison threshold options that are wide enough to allow testing between different
 * operating systems without failure (usually).
 *
 * @category Internal
 */
export async function expectScreenshot(
    testContext: Readonly<UniversalTestContext>,
    options: Readonly<SaveScreenshotOptions>,
) {
    assertTestContext(testContext, TestEnv.Playwright);

    const currentScreenshotBuffer = await takeScreenshotBuffer(testContext, options);

    const screenshotFilePath = getScreenshotPath(testContext, options.screenshotBaseName);

    async function writeNewScreenshot() {
        log.mutate(`Updated screenshot: ${relative(process.cwd(), screenshotFilePath)}`);
        await saveScreenshotBuffer(
            testContext,
            currentScreenshotBuffer,
            options.screenshotBaseName,
        );
    }
    async function writeExpectationScreenshot(contents: Buffer, fileName: string) {
        const filePath = assertWrapTestContext(testContext, TestEnv.Playwright).testInfo.outputPath(
            addSuffix({value: fileName, suffix: '.png'}),
        );
        await writeFileAndDir(filePath, contents);
    }

    if (existsSync(screenshotFilePath)) {
        if (testContext.testInfo.config.updateSnapshots === 'changed') {
            await writeNewScreenshot();
        }
    } else {
        if (testContext.testInfo.config.updateSnapshots !== 'none') {
            await writeNewScreenshot();
        }
        await writeExpectationScreenshot(currentScreenshotBuffer, 'actual');
        throw new Error(
            `Baseline screenshot not found: ${screenshotFilePath}. Re-run with --update-snapshots to create it.`,
        );
    }

    const baseScreenshotBuffer: Buffer = await readFile(screenshotFilePath);
    const {
        aPng: baseScreenshotPng,
        bPng: currentScreenshotPng,
        dimensions,
    } = await padToSameCanvas(baseScreenshotBuffer, currentScreenshotBuffer);

    const diffPng = new PNG(dimensions);
    const diffPixelCount = pixelmatch(
        baseScreenshotPng.data,
        currentScreenshotPng.data,
        diffPng.data,
        dimensions.width,
        dimensions.height,
        {
            threshold: defaultScreenshotOptions.threshold,
        },
    );

    const totalPixels = dimensions.width * dimensions.height;
    const diffRatio = diffPixelCount / totalPixels;

    const ratioOk = diffRatio <= defaultScreenshotOptions.maxDiffPixelRatio;

    if (!ratioOk) {
        if (process.env.CI) {
            await writeNewScreenshot();
        } else {
            await writeExpectationScreenshot(PNG.sync.write(baseScreenshotPng), 'expected');
            await writeExpectationScreenshot(PNG.sync.write(currentScreenshotPng), 'actual');
            await writeExpectationScreenshot(PNG.sync.write(diffPng), 'diff');

            throw new Error(
                `Screenshot mismatch: ${screenshotFilePath}\n diff=${diffPixelCount}px (${(diffRatio * 100).toFixed(3)}%) (limit: ${(defaultScreenshotOptions.maxDiffPixelRatio * 100).toFixed(3)}%). Run with --update-snapshots to update screenshot.`,
            );
        }
    }
}
