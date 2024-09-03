import {DeferredPromise} from '@augment-vir/common';

/**
 * Load a video from a URL and wait for it to be totally loaded.
 *
 * @category Web
 * @package @augment-vir/web
 */
export async function loadVideo(videoUrl: string): Promise<HTMLVideoElement> {
    const deferredPromise = new DeferredPromise<HTMLVideoElement>();
    const videoElement = document.createElement('video');
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
