import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';
import {MaybePromise} from '../promise/maybe-promise.js';

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

/** TODO: ADD EXAMPLES */
export class Debounce {
    private nextCallTimestamp = 0;
    private latestCallback: (() => MaybePromise<void>) | undefined;

    constructor(
        public debounceStyle: DebounceStyle,
        public debounceDuration: AnyDuration,
        callback?: typeof this.latestCallback | undefined,
    ) {
        if (callback) {
            this.latestCallback = callback;
        }
    }

    public execute(callback?: typeof this.latestCallback | undefined) {
        if (!callback) {
            return;
        }
        this.latestCallback = callback;
        const now = Date.now();

        if (this.nextCallTimestamp > now) {
            return;
        }

        if (this.debounceStyle === DebounceStyle.FirstThenWait) {
            void this.latestCallback();
        } else {
            setTimeout(() => {
                /** Use whatever the latest latestCallback is. */
                void this.latestCallback?.();
            }, this.debounceDuration.milliseconds);
        }
        this.nextCallTimestamp =
            now + convertDuration(this.debounceDuration, DurationUnit.Milliseconds).milliseconds;
    }
}
