export enum DebounceStyle {
    /**
     * Fires on the first call, then waits the given amount of milliseconds until a subsequent call
     * can be made.
     */
    FirstThenWait = 'first-then-wait',
    /**
     * Waits the given amount of milliseconds after the first call and then fires the latest
     * assigned callback.
     */
    AfterWait = 'after-wait',
}

export function createDebounce(
    debounceStyle: DebounceStyle,
    debounceDuration: {milliseconds: number},
) {
    let nextCallTimestamp = 0;
    let latestCallback: (() => void) | undefined = undefined;

    return (callback: () => void) => {
        latestCallback = callback;
        const now = Date.now();

        if (nextCallTimestamp > now) {
            return;
        }

        if (debounceStyle === DebounceStyle.FirstThenWait) {
            latestCallback();
        } else if (debounceStyle === DebounceStyle.AfterWait) {
            setTimeout(() => {
                /** Use whatever the latest latestCallback is. */
                latestCallback?.();
            }, debounceDuration.milliseconds);
        }
        nextCallTimestamp = now + debounceDuration.milliseconds;
    };
}
