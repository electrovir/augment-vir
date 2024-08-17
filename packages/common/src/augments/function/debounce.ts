import {MaybePromise} from '@augment-vir/core';
import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';

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

export class Debounce {
    public nextCallTimestamp = 0;
    public callback: (() => MaybePromise<void>) | undefined;

    constructor(
        public debounceStyle: DebounceStyle,
        public debounceDuration: AnyDuration,
        callback?: typeof this.callback | undefined,
    ) {
        if (callback) {
            this.callback = callback;
        }
    }

    public execute(callback?: typeof this.callback | undefined) {
        if (callback) {
            this.callback = callback;
        } else if (!this.callback) {
            return;
        }
        const now = Date.now();

        if (this.nextCallTimestamp > now) {
            return;
        }

        if (this.debounceStyle === DebounceStyle.FirstThenWait) {
            void this.callback();
        } else {
            setTimeout(() => {
                /** Use whatever the latest latestCallback is. */
                void this.callback?.();
            }, this.debounceDuration.milliseconds);
        }
        this.nextCallTimestamp =
            now + convertDuration(this.debounceDuration, DurationUnit.Milliseconds).milliseconds;
    }
}
