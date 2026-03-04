import {assert, waitUntil} from '@augment-vir/assert';
import {DeferredPromise, type Tuple} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {typedMap} from '../array/array-map.js';
import {PromiseQueue, PromiseQueueUpdateEvent} from './promise-queue.js';

describe(PromiseQueue.name, () => {
    it('waits for resolution', async () => {
        const startSize = 6;
        const deferredPromises = new Array(startSize).fill(0).map((index) => {
            if (index === 4) {
                return undefined;
            }
            return new DeferredPromise();
        }) as Tuple<DeferredPromise, typeof startSize>;
        const addResults: ('resolved' | 'rejected')[] = [];

        const queueEvents: PromiseQueueUpdateEvent[] = [];

        const queue = new PromiseQueue();

        deferredPromises.forEach((deferredPromise) => {
            queue
                .add(() => deferredPromise.promise)
                .then(() => {
                    addResults.push('resolved');
                })
                .catch(() => {
                    addResults.push('rejected');
                });
        });
        queue.listen(PromiseQueueUpdateEvent, (event) => queueEvents.push(event));

        function readState() {
            const newState = {
                size: queue.size,
                promises: typedMap(
                    deferredPromises,
                    (deferredPromise) => deferredPromise.isSettled,
                ),
                addResults: [...addResults],
                events: queueEvents.map((event) => {
                    return {
                        queueSize: event.detail.queueSize,
                        addedItem: !!event.detail.addedItem,
                        finishedItem: !!event.detail.finishedItem,
                    };
                }),
            };

            return newState;
        }

        assert.deepEquals(
            readState(),
            {
                size: startSize,
                events: [],
                addResults: [],
                promises: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            },
            'nothing should be resolved yet',
        );

        deferredPromises[1].resolve();
        assert.deepEquals(
            readState(),
            {
                size: startSize,
                events: [],
                addResults: [],
                promises: [
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                ],
            },
            'the queue should not have moved yet',
        );

        deferredPromises[0].resolve();
        await waitUntil.deepEquals(
            {
                size: startSize - 2,
                events: [
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 1,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 2,
                    },
                ],
                addResults: [
                    'resolved',
                    'resolved',
                ],
                promises: [
                    true,
                    true,
                    false,
                    false,
                    false,
                    false,
                ],
            },
            readState,
            undefined,
            'the first and second items should have been processed in the queue',
        );

        deferredPromises[2].reject();
        await waitUntil.deepEquals(
            {
                size: startSize - 3,
                events: [
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 1,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 2,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 3,
                    },
                ],
                addResults: [
                    'resolved',
                    'resolved',
                    'rejected',
                ],
                promises: [
                    true,
                    true,
                    true,
                    false,
                    false,
                    false,
                ],
            },
            readState,
            undefined,
            'the third item should have been processed in the queue',
        );

        deferredPromises[3].resolve();
        await waitUntil.deepEquals(
            {
                size: startSize - 4,
                events: [
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 1,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 2,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 3,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 4,
                    },
                ],
                addResults: [
                    'resolved',
                    'resolved',
                    'rejected',
                    'resolved',
                ],
                promises: [
                    true,
                    true,
                    true,
                    true,
                    false,
                    false,
                ],
            },
            readState,
            undefined,
            'the fourth item should have been processed in the queue',
        );

        deferredPromises[4].resolve();
        await waitUntil.deepEquals(
            {
                size: startSize - 5,
                events: [
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 1,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 2,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 3,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 4,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 5,
                    },
                ],
                addResults: [
                    'resolved',
                    'resolved',
                    'rejected',
                    'resolved',
                    'resolved',
                ],
                promises: [
                    true,
                    true,
                    true,
                    true,
                    true,
                    false,
                ],
            },
            readState,
            undefined,
            'the fifth item should have been processed in the queue',
        );

        deferredPromises[5].resolve();
        await waitUntil.deepEquals(
            {
                size: startSize - 6,
                events: [
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 1,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 2,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 3,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 4,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 5,
                    },
                    {
                        addedItem: false,
                        finishedItem: true,
                        queueSize: startSize - 6,
                    },
                ],
                addResults: [
                    'resolved',
                    'resolved',
                    'rejected',
                    'resolved',
                    'resolved',
                    'resolved',
                ],
                promises: [
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                ],
            },
            readState,
            undefined,
            'the sixth item should have been processed in the queue',
        );
    });

    it("fails to handle an item if there isn't currently one waiting", () => {
        class TestPromiseQueue extends PromiseQueue {
            public test() {
                super.handleItemSettle({
                    resolution: 'b',
                });
            }
        }

        const testInstance = new TestPromiseQueue();

        assert.throws(() => testInstance.test(), {
            matchMessage: 'Cannot handle queue item',
        });
    });

    it('detects when a queue id is present', async () => {
        const innerPromise = new DeferredPromise();

        const queue = new PromiseQueue();
        const testId = 'hello';

        const addPromise = queue.add(async () => {
            await innerPromise.promise;
        }, testId);
        assert.isTrue(queue.hasItemById(testId));
        innerPromise.resolve();
        await addPromise;
        assert.isFalse(queue.hasItemById(testId));
    });
});
