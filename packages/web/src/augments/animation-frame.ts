import {DeferredPromise} from '@augment-vir/common';

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
