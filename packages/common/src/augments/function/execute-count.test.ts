import {assert} from '@augment-vir/assert';
import {DeferredPromise, wait, type MaybePromise, type Tuple} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {executeCount} from './execute-count.js';

describe(executeCount.name, () => {
    it('has proper types', async () => {
        const syncResult = executeCount(3, () => 'hello');
        assert.tsType(syncResult).equals<Tuple<string, 3>>();

        const asyncResult = executeCount(3, async () => {
            await wait({
                milliseconds: 0,
            });
            return 'hello';
        });
        assert.tsType(asyncResult).equals<Promise<Tuple<string, 3>>>();
        await asyncResult;

        const maybePromiseResult = executeCount(3, (): MaybePromise<string> => 'hello');
        assert.tsType(maybePromiseResult).equals<MaybePromise<Tuple<string, 3>>>();
        await maybePromiseResult;

        const voidResult = executeCount(2, () => {});
        assert.tsType(voidResult).notEquals<Promise<Tuple<void | undefined, 2>>>();

        const asyncVoidResult = executeCount(2, async () => {
            await wait({
                milliseconds: 0,
            });
        });
        assert.tsType(asyncVoidResult).equals<Promise<Tuple<void, 2>>>();
        await asyncVoidResult;
    });

    it('executes callback the correct number of times', () => {
        const calls: {currentCount: number; totalCount: number}[] = [];
        executeCount(5, (currentCount, totalCount) => {
            calls.push({
                currentCount,
                totalCount,
            });
        });

        assert.deepEquals(calls, [
            {
                currentCount: 1,
                totalCount: 5,
            },
            {
                currentCount: 2,
                totalCount: 5,
            },
            {
                currentCount: 3,
                totalCount: 5,
            },
            {
                currentCount: 4,
                totalCount: 5,
            },
            {
                currentCount: 5,
                totalCount: 5,
            },
        ]);
    });

    it('executes zero times when count is 0', () => {
        const calls: {currentCount: number; totalCount: number}[] = [];
        executeCount(0, (currentCount, totalCount) => {
            calls.push({
                currentCount,
                totalCount,
            });
        });

        assert.deepEquals(calls, []);
    });

    it('collects return values', async () => {
        const result = await executeCount(4, async (currentCount) => {
            await wait({
                milliseconds: 0,
            });
            return currentCount * 10;
        });
        assert.deepEquals(
            result,
            [
                10,
                20,
                30,
                40,
            ],
        );
    });

    it('executes sequentially', async () => {
        const executionOrder: number[] = [];

        const result = await executeCount(4, async (currentCount) => {
            /** Earlier calls wait longer; if parallel, order would be reversed. */
            await wait({
                milliseconds: 5 - currentCount,
            });
            executionOrder.push(currentCount);
            return currentCount;
        });

        assert.deepEquals(
            executionOrder,
            [
                1,
                2,
                3,
                4,
            ],
        );
        assert.deepEquals(
            result,
            [
                1,
                2,
                3,
                4,
            ],
        );
        assert.tsType(result).equals<Tuple<number, 4>>();
    });

    it('executes sequentially with a callback that sometimes returns a promise', async () => {
        const executionOrder: number[] = [];

        const result = await executeCount(4, (currentCount) => {
            if (currentCount % 2) {
                executionOrder.push(currentCount);
                return currentCount;
            } else {
                /** Even counts return a promise. */
                const deferredPromise = new DeferredPromise<number>();
                wait({
                    milliseconds: 1,
                })
                    .then(() => deferredPromise.resolve(currentCount))
                    .catch(() => deferredPromise.reject());

                executionOrder.push(currentCount);
                return deferredPromise.promise;
            }
        });

        assert.deepEquals(
            executionOrder,
            [
                1,
                2,
                3,
                4,
            ],
        );
        assert.deepEquals(
            result,
            [
                1,
                2,
                3,
                4,
            ],
        );
        assert.tsType(result).equals<Tuple<number, 4>>();
    });

    it('executes sequentially with a callback that never returns a promise', () => {
        const executionOrder: number[] = [];

        const result = executeCount(4, (currentCount) => {
            executionOrder.push(currentCount);
            return currentCount;
        });

        assert.deepEquals(
            executionOrder,
            [
                1,
                2,
                3,
                4,
            ],
        );
        assert.deepEquals(
            result,
            [
                1,
                2,
                3,
                4,
            ],
        );
        assert.tsType(result).equals<Tuple<number, 4>>();
    });

    it('executes a single iteration', async () => {
        const result = await executeCount(1, async (currentCount, totalCount) => {
            await wait({
                milliseconds: 0,
            });
            assert.strictEquals(currentCount, 1);
            assert.strictEquals(totalCount, 1);
            return 'only';
        });
        assert.deepEquals(result, ['only']);
    });
});
