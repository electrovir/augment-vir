import {MaybePromise} from '@augment-vir/core';
import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';

/** Different types of debouncing for the {@link Debounce} class. */
export enum DebounceStyle {
    /**
     * Fires on the first call, then waits the given amount of milliseconds until another call is
     * allowed through.
     *
     * `.execute()` calls with a 25ms debounce time looks like this:
     *
     * | 1st `.execute()` | 2nd `.execute()` | 3rd `.execute()` | 4th `.execute()` |
     * | ---------------- | ---------------- | ---------------- | ---------------- |
     * | 0ms              | 10ms             | 20ms             | 30ms             |
     * | fired!           |                  |                  | fired!           |
     */
    FirstThenWait = 'first-then-wait',
    /**
     * Waits the given amount of milliseconds after the first call and then fires the latest
     * assigned callback.
     *
     * `.execute()` calls with a 25ms debounce time looks like this:
     *
     * | 1st `.execute()` | 2nd `.execute()` | 3rd `.execute()` | -      | 4th `.execute()` | ...    |
     * | ---------------- | ---------------- | ---------------- | ------ | ---------------- | ------ |
     * | 0ms              | 10ms             | 20ms             | 25ms   | 30ms             | 50ms   |
     * |                  |                  |                  | fired! |                  | fired! |
     */
    AfterWait = 'after-wait',
}

/**
 * Enable debouncing of callbacks, with various styles of debounce supported in {@link DebounceStyle}
 * (see its docs for debounce style details). A callback can be provided on construction or to the
 * `.execute()` method.
 *
 * @category Function : Common
 * @example
 *
 * ```ts
 * import {Debounce} from '@augment-vir/common';
 *
 * const debounce = new Debounce(
 *     DebounceStyle.FirstThenWait,
 *     {
 *         milliseconds: 500,
 *     },
 *     // callback can optionally be provided on construction
 *     () => {
 *         console.log('called');
 *     },
 * );
 *
 * debounce.execute();
 * // providing a callback in `.execute()` permanently overrides the callback provided in construction.
 * debounce.execute(() => {});
 * ```
 *
 * @package @augment-vir/common
 */
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
