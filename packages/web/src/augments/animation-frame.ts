import {DeferredPromise} from '@augment-vir/common';

/**
 * Wait for an animation frame's duration. Optionally, wait for multiple frames by providing a
 * `frameCount` input.
 *
 * @category Web
 * @category Package : @augment-vir/web
 * @package @augment-vir/web
 */
export async function waitForAnimationFrame(frameCount: number = 1): Promise<void> {
    const deferredPromise = new DeferredPromise<void>();

    function requestNextFrame() {
        requestAnimationFrame(() => {
            frameCount--;
            if (frameCount) {
                requestNextFrame();
            } else {
                deferredPromise.resolve();
            }
        });
    }
    requestNextFrame();

    return deferredPromise.promise;
}
