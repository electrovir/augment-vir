import {assert} from '@augment-vir/assert';
import {addSuffix, log, type Dimensions} from '@augment-vir/common';
import {writeFileAndDir} from '@augment-vir/node';
import {expect, type Locator, type Page, type TestInfo} from '@playwright/test';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {relative} from 'node:path';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';
import sharp from 'sharp';

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

async function takeScreenshot({
    locator,
    page,
    options,
}: {
    page: Readonly<Page>;
    locator: Readonly<Locator> | undefined;
    options: Partial<LocatorScreenshotOptions>;
}): Promise<Buffer> {
    if (locator) {
        /** The locator expectation has different options than the page expectation. */
        return await locator.screenshot({...defaultScreenshotOptions, ...options});
    } else {
        return await page.screenshot({
            ...defaultScreenshotOptions,
            ...options,
        });
    }
}

/**
 * Similar to Playwright's `expect().toHaveScreenshot` but allows images to have different sizes and
 * has default comparison threshold options that are wide enough to allow testing between different
 * operating systems without failure (usually).
 *
 * @category Internal
 */
export async function expectScreenshot(
    page: Readonly<Page>,
    {
        locator,
        screenshotName,
        testInfo,
        options = {},
    }: {
        testInfo: Readonly<TestInfo>;
        /** If no locator is provided, a screenshot of the whole page will be taken. */
        locator: Readonly<Locator> | undefined;
        screenshotName: string;
        options?: Partial<LocatorScreenshotOptions> | undefined;
    },
) {
    const screenshotFileName = addSuffix({value: screenshotName, suffix: '.png'});

    const currentScreenshotBuffer = await takeScreenshot({page, locator, options});

    const screenshotFilePath = testInfo.snapshotPath(screenshotFileName);

    async function writeNewScreenshot() {
        log.mutate(`Updated screenshot: ${relative(process.cwd(), screenshotFilePath)}`);
        await writeFileAndDir(screenshotFilePath, currentScreenshotBuffer);
    }
    async function writeExpectationScreenshot(contents: Buffer, fileName: string) {
        const filePath = testInfo.outputPath(addSuffix({value: fileName, suffix: '.png'}));
        await writeFileAndDir(filePath, contents);
    }

    if (existsSync(screenshotFilePath)) {
        if (testInfo.config.updateSnapshots === 'changed') {
            await writeNewScreenshot();
        }
    } else {
        if (testInfo.config.updateSnapshots !== 'none') {
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
