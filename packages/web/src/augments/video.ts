import {DeferredPromise} from '@augment-vir/common';

/**
 * Load a video from a URL and wait for it to be totally loaded.
 *
 * @category Web
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export async function loadVideo(videoUrl: string): Promise<HTMLVideoElement> {
    const deferredPromise = new DeferredPromise<HTMLVideoElement>();
    const videoElement = document.createElement('video');
    /** This doesn't work in WebKit on Windows. */
    /* node:coverage ignore next 3 */
    videoElement.addEventListener('loadeddata', () => {
        deferredPromise.resolve(videoElement);
    });
    videoElement.onerror = () => {
        deferredPromise.reject(new Error(`Failed to load '${videoUrl}'`));
    };
    videoElement.src = videoUrl;
    videoElement.load();
    return deferredPromise.promise;
}
