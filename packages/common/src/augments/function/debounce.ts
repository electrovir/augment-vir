import {type MaybePromise} from '@augment-vir/core';
import {type AnyDuration, convertDuration} from '@date-vir/duration';

/**
 * Different types of debouncing for the {@link Debounce} class.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
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
    /**
     * Fires on the first call, then fires at most once per the given amount of milliseconds with
     * the latest assigned callback. Calls that land inside a wait are not dropped: the last one
     * fires when the wait ends. Useful for resize handlers that need both an instant response and
     * the final value.
     *
     * `.execute()` calls with a 25ms debounce time looks like this:
     *
     * | 1st `.execute()` | 2nd `.execute()` | 3rd `.execute()` | -      | 4th `.execute()` | ...    |
     * | ---------------- | ---------------- | ---------------- | ------ | ---------------- | ------ |
     * | 0ms              | 10ms             | 20ms             | 25ms   | 30ms             | 50ms   |
     * | fired!           |                  |                  | fired! |                  | fired! |
     */
    FirstThenLatest = 'first-then-latest',
}

/**
 * Enable debouncing of callbacks, with various styles of debounce supported in {@link DebounceStyle}
 * (see its docs for debounce style details). A callback can be provided on construction or to the
 * `.execute()` method.
 *
 * @category Function
 * @category Package : @augment-vir/common
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
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export class Debounce {
    public nextCallTimestamp = 0;

    constructor(
        /** Debounce style. See {@link DebounceStyle} for more details. */
        public debounceStyle: DebounceStyle,
        /** Duration between debounces. */
        public debounceDuration: AnyDuration,
        /**
         * Set the callback to be triggered on `.execute()`. If this is not set, the callback to be
         * called can be passed in `.execute()` instead.
         */
        public callback?: (() => MaybePromise<void>) | undefined,
    ) {
        if (callback) {
            this.callback = callback;
        }
    }

    /** The scheduled trailing call for {@link DebounceStyle.FirstThenLatest}. */
    protected pendingTimeout: ReturnType<typeof setTimeout> | undefined;

    protected readonly styleExecutors: Readonly<
        Record<DebounceStyle, (params: Readonly<{now: number; durationMs: number}>) => void>
    > = {
        [DebounceStyle.FirstThenWait]: ({now, durationMs}) => {
            if (this.nextCallTimestamp > now) {
                return;
            }
            void this.callback?.();
            this.nextCallTimestamp = now + durationMs;
        },
        [DebounceStyle.AfterWait]: ({now, durationMs}) => {
            if (this.nextCallTimestamp > now) {
                return;
            }
            setTimeout(() => {
                /** Use whatever the latest latestCallback is. */
                void this.callback?.();
            }, this.debounceDuration.milliseconds);
            this.nextCallTimestamp = now + durationMs;
        },
        [DebounceStyle.FirstThenLatest]: ({now, durationMs}) => {
            if (this.pendingTimeout) {
                /** `execute` already stored the latest callback for the pending call to use. */
                return;
            } else if (this.nextCallTimestamp <= now) {
                void this.callback?.();
                this.nextCallTimestamp = now + durationMs;
            } else {
                this.pendingTimeout = setTimeout(() => {
                    this.pendingTimeout = undefined;
                    this.nextCallTimestamp = Date.now() + durationMs;
                    void this.callback?.();
                }, this.nextCallTimestamp - now);
            }
        },
    };

    /** Call the callback, if one has been set yet, if the current debounce timer is up. */
    public execute(callback?: typeof this.callback | undefined) {
        if (callback) {
            this.callback = callback;
        } else if (!this.callback) {
            return;
        }

        this.styleExecutors[this.debounceStyle]({
            now: Date.now(),
            durationMs: convertDuration(this.debounceDuration, {
                milliseconds: true,
            }).milliseconds,
        });
    }
}
