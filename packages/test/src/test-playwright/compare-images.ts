import type {Dimensions} from '@augment-vir/common';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';
import sharp from 'sharp';

/**
 * Options for image comparison thresholds.
 *
 * @category Internal
 */
export type ImageComparisonOptions = {
    /**
     * Per-pixel color threshold for `pixelmatch` (0–1). Smaller values make comparison more
     * sensitive.
     */
    threshold: number;
    /** Maximum ratio of differing pixels allowed before the comparison is considered a failure. */
    maxDiffPixelRatio: number;
};

/**
 * Default image comparison options used in {@link compareImages}.
 *
 * @category Internal
 */
export const defaultImageComparisonOptions: Readonly<ImageComparisonOptions> = {
    threshold: 0.1,
    maxDiffPixelRatio: 0.08,
};

/**
 * The result of comparing two images via {@link compareImages}.
 *
 * @category Internal
 */
export type ImageComparisonResult = {
    /** Whether the images match within the allowed diff ratio. */
    passed: boolean;
    /** The number of differing pixels. */
    diffPixelCount: number;
    /** Total pixel count of the (padded) comparison canvas. */
    totalPixels: number;
    /** The ratio of differing pixels to total pixels. */
    diffRatio: number;
    /** The dimensions of the comparison canvas. */
    dimensions: Readonly<Dimensions>;
    /** PNG data for the base image (padded to the comparison canvas). */
    basePng: PNG;
    /** PNG data for the current image (padded to the comparison canvas). */
    currentPng: PNG;
    /** PNG data for the visual diff output. */
    diffPng: PNG;
};

async function padImage(image: Buffer, {height, width}: Dimensions) {
    return await sharp({
        create: {width, height, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0}},
    })
        /** Top-left align. */
        .composite([{input: image, left: 0, top: 0}])
        .png()
        .toBuffer();
}

/**
 * Pads both images to the same canvas size (max width/height of the two) without scaling, then
 * returns the decoded PNGs and the shared dimensions.
 *
 * @category Internal
 */
export async function padToSameCanvas(aBuf: Buffer, bBuf: Buffer) {
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

/**
 * Compare two PNG image buffers pixel-by-pixel. The images may have different dimensions — they
 * will be padded to the same canvas size before comparison.
 *
 * This function is fully Playwright-agnostic and can be used in any Node.js context.
 *
 * @category Internal
 */
export async function compareImages(
    baseImageBuffer: Buffer,
    currentImageBuffer: Buffer,
    options: Readonly<ImageComparisonOptions> = defaultImageComparisonOptions,
): Promise<ImageComparisonResult> {
    const {
        aPng: basePng,
        bPng: currentPng,
        dimensions,
    } = await padToSameCanvas(baseImageBuffer, currentImageBuffer);

    const diffPng = new PNG(dimensions);
    const diffPixelCount = pixelmatch(
        basePng.data,
        currentPng.data,
        diffPng.data,
        dimensions.width,
        dimensions.height,
        {
            threshold: options.threshold,
        },
    );

    const totalPixels = dimensions.width * dimensions.height;
    const diffRatio = diffPixelCount / totalPixels;
    const passed = diffRatio <= options.maxDiffPixelRatio;

    return {
        passed,
        diffPixelCount,
        totalPixels,
        diffRatio,
        dimensions,
        basePng,
        currentPng,
        diffPng,
    };
}

/**
 * Encode a {@link PNG} instance to a `Buffer`.
 *
 * @category Internal
 */
export function encodePng(png: PNG): Buffer {
    return PNG.sync.write(png);
}
