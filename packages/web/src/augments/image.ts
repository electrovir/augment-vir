import {DeferredPromise} from '@augment-vir/common';

export async function loadImage(imageUrl: string): Promise<HTMLImageElement> {
    const deferredPromise = new DeferredPromise<HTMLImageElement>();
    const newImage = new Image();
    newImage.onload = () => {
        deferredPromise.resolve(newImage);
    };
    newImage.onerror = () => {
        deferredPromise.reject(new Error(`Failed to load '${imageUrl}'`));
    };
    newImage.src = imageUrl;

    return deferredPromise.promise;
}
