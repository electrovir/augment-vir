import {type MaybePromise} from '@augment-vir/common';

/**
 * Listen for an element to disconnect from the document.
 *
 * @category Web : Elements
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function listenToElementDisconnect(
    element: Element,
    listener: () => MaybePromise<void>,
): () => void {
    if (!element.isConnected) {
        /**
         * If the element already is not connected, immediately fire the listener and then do
         * nothing else.
         */
        void listener();
        return () => {};
    }
    const observer = new MutationObserver(async () => {
        if (!element.isConnected) {
            observer.disconnect();
            await listener();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    return () => observer.disconnect();
}
