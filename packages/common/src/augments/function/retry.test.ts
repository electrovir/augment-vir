import {assert} from '@augment-vir/assert';
import {wait, type MaybePromise} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {retry, type RetryCallbackParams} from './retry.js';

describe(retry.name, () => {
    it('has proper types', async () => {
        const result = retry(2, () => true);
        assert.tsType(result).equals<boolean>();

        const syncResultWithInterval = retry(2, () => true, {
            interval: {
                milliseconds: 1,
            },
        });
        assert.tsType(syncResultWithInterval).equals<Promise<boolean>>();
        await syncResultWithInterval;

        const asyncResultWithInterval = retry(
            2,
            async () => {
                await wait({
                    milliseconds: 0,
                });
                return true;
            },
            {
                interval: {
                    milliseconds: 1,
                },
            },
        );
        assert.tsType(asyncResultWithInterval).equals<Promise<boolean>>();
        await asyncResultWithInterval;

        const promiseResult = retry(2, async () => {
            await wait({
                milliseconds: 0,
            });
            return true;
        });
        assert.tsType(promiseResult).equals<Promise<boolean>>();
        await promiseResult;

        const maybePromiseResult = retry(2, (): MaybePromise<boolean> => {
            return true;
        });
        assert.tsType(maybePromiseResult).equals<MaybePromise<boolean>>();
        await maybePromiseResult;
    });

    it('retries', () => {
        let counter = 0;
        const result = retry(2, () => {
            ++counter;
            if (counter < 2) {
                throw new Error('fail');
            }
            return 'hi';
        });
        assert.strictEquals(result, 'hi');
    });
    it('retries with interval', async () => {
        let counter = 0;
        const result = await retry(
            2,
            () => {
                ++counter;
                if (counter < 2) {
                    throw new Error('fail');
                }
                return 'hi';
            },
            {
                interval: {
                    milliseconds: 1,
                },
            },
        );
        assert.strictEquals(result, 'hi');
    });
    it('retries with async callback', async () => {
        let counter = 0;
        const result = await retry(2, async () => {
            await wait({
                milliseconds: 0,
            });
            ++counter;
            if (counter < 2) {
                throw new Error('fail');
            }
            return 'hi';
        });
        assert.strictEquals(result, 'hi');
    });
    it('retries with async callback and interval', async () => {
        let counter = 0;
        const result = await retry(
            2,
            async () => {
                await wait({
                    milliseconds: 0,
                });
                ++counter;
                if (counter < 2) {
                    throw new Error('fail');
                }
                return 'hi';
            },
            {
                interval: {
                    milliseconds: 1,
                },
            },
        );
        assert.strictEquals(result, 'hi');
    });
    it('fails', () => {
        const allParams: RetryCallbackParams[] = [];

        assert.throws(
            () =>
                retry(2, (params): string => {
                    allParams.push(params);
                    throw new Error('fail');
                }),
            {
                matchMessage: 'Retry max reached: fail',
            },
        );

        assert.deepEquals(allParams, [
            {
                retryCount: 0,
                isFirstExecution: true,
                isFirstRetry: false,
                isLastRetry: false,
            },
            {
                retryCount: 1,
                isFirstExecution: false,
                isFirstRetry: true,
                isLastRetry: false,
            },
            {
                retryCount: 2,
                isFirstExecution: false,
                isFirstRetry: false,
                isLastRetry: true,
            },
        ]);
    });
    it('fails with async callback', async () => {
        await assert.throws(
            () =>
                retry(2, async (): Promise<string> => {
                    await wait({
                        milliseconds: 0,
                    });
                    throw new Error('fail');
                }),
            {
                matchMessage: 'Retry max reached: fail',
            },
        );
    });
});
