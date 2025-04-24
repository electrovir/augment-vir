import {check} from '@augment-vir/assert';
import {DeferredPromise, type MaybePromise} from '@augment-vir/core';
import {type RequireExactlyOne} from 'type-fest';
import {defineTypedCustomEvent, ListenTarget} from 'typed-event-target';

/**
 * An individual item in a {@link PromiseQueue} instance.
 *
 * @category Promise : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PromiseQueueItem<T = void> = {
    /** The original queue item that was added. */
    original: () => MaybePromise<T>;
    /**
     * A {@link DeferredPromise} instance with a promise that is resolved once this queue item has
     * met its turn and has finished executing.
     */
    wrapper: DeferredPromise<T>;
};

/**
 * Data contained within an instance of {@link PromiseQueueUpdateEvent}.
 *
 * @category Promise : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PromiseQueueUpdate<T = unknown> = {
    queueSize: number;
} & RequireExactlyOne<{
    finishedItem: PromiseQueueItem<T>;
    addedItem: PromiseQueueItem<T>;
}>;

/**
 * The event emitted from a {@link PromiseQueue} instance whenever the queue is updated (an item is
 * resolved or an item is added).
 *
 * @category Promise : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export class PromiseQueueUpdateEvent extends defineTypedCustomEvent<PromiseQueueUpdate>()(
    'promise-queue-update',
) {}

/**
 * A queue that manages its items with promises.
 *
 * @category Promise
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export class PromiseQueue extends ListenTarget<PromiseQueueUpdateEvent> {
    protected queue: PromiseQueueItem<any>[] = [];
    protected currentlyAwaiting: undefined | PromiseQueueItem<any> = undefined;

    /** The current size of the queue. */
    public get size() {
        return this.queue.length;
    }

    /**
     * Add an item to the queue.
     *
     * @returns A promise that resolves at the same time as the added item.
     */
    public add<T = void>(item: PromiseQueueItem<T>['original']): Promise<T> {
        const newItem: PromiseQueueItem<any> = {
            original: item,
            wrapper: new DeferredPromise<T>(),
        };

        this.queue.push(newItem);
        this.dispatch(
            new PromiseQueueUpdateEvent({
                detail: {
                    queueSize: this.size,
                    addedItem: newItem,
                },
            }),
        );

        this.triggerNextQueueItem();

        return newItem.wrapper.promise;
    }

    /** Handles a queue item finishing, whether it be a rejection or a resolution. */
    protected handleItemSettle({
        rejection,
        resolution,
    }: RequireExactlyOne<{rejection: unknown; resolution: unknown}>) {
        const item = this.currentlyAwaiting;
        if (!item) {
            throw new Error(
                `Cannot handle queue item settle without a currently awaited queue item.`,
            );
        }

        this.queue.splice(0, 1);
        this.dispatch(
            new PromiseQueueUpdateEvent({
                detail: {
                    queueSize: this.size,
                    finishedItem: item,
                },
            }),
        );
        if (rejection) {
            item.wrapper.reject(rejection);
        } else {
            item.wrapper.resolve(resolution);
        }
        this.currentlyAwaiting = undefined;

        this.triggerNextQueueItem();

        return item;
    }

    /**
     * Tries to trigger the next queue item, if there is one.
     *
     * @returns Whether a new queue item was triggered or not. `true` if it was, otherwise `false`.
     */
    protected triggerNextQueueItem(): boolean {
        if (this.currentlyAwaiting || !check.isLengthAtLeast(this.queue, 1)) {
            return false;
        }

        const item = this.queue[0];
        this.currentlyAwaiting = item;
        item.original()
            .then((result: unknown) => {
                this.handleItemSettle({resolution: result});
            })
            .catch((error: unknown) => {
                this.handleItemSettle({rejection: error});
            });

        return true;
    }
}
