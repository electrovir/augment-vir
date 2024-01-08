export type RemoveListener = () => void;

/** A wrapper for `globalThis.addEventListener` */
export function listenToGlobal<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: typeof globalThis, event: WindowEventMap[K]) => void,
    options?: Readonly<AddEventListenerOptions>,
): RemoveListener {
    const listenerParams: Parameters<typeof window.addEventListener<any>> = [
        type,
        listener as unknown as (this: Window, ev: WindowEventMap[K]) => any,
        options,
    ];

    globalThis.addEventListener(...listenerParams);
    return () => {
        globalThis.removeEventListener(...listenerParams);
    };
}
