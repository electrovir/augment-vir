import {createDeferredPromiseWrapper} from '@augment-vir/common';

export async function loadVideo(videoUrl: string): Promise<HTMLVideoElement> {
    const deferredPromise = createDeferredPromiseWrapper<HTMLVideoElement>();
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
