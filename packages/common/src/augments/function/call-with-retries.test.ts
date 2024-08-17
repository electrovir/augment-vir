import {assert} from '@augment-vir/assert';
import {wait, type MaybePromise} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {callWithRetries} from './call-with-retries.js';

describe(callWithRetries.name, () => {
    it('has proper types', async () => {
        const result = callWithRetries(2, () => true);
        assert.tsType(result).equals<boolean>();

        const promiseResult = callWithRetries(2, async () => {
            await wait({milliseconds: 0});
            return true;
        });
        assert.tsType(promiseResult).equals<Promise<boolean>>();
        await promiseResult;

        const maybePromiseResult = callWithRetries(2, (): MaybePromise<boolean> => {
            return true;
        });
        assert.tsType(maybePromiseResult).equals<MaybePromise<boolean>>();
        await maybePromiseResult;
    });

    it('retries', () => {
        let counter = 0;
        const result = callWithRetries(2, () => {
            ++counter;
            if (counter < 2) {
                throw new Error('fail');
            }
            return 'hi';
        });
        assert.strictEquals(result, 'hi');
    });
    it('retries with async callback', async () => {
        let counter = 0;
        const result = await callWithRetries(2, async () => {
            await wait({milliseconds: 0});
            ++counter;
            if (counter < 2) {
                throw new Error('fail');
            }
            return 'hi';
        });
        assert.strictEquals(result, 'hi');
    });
    it('fails', () => {
        assert.throws(
            () =>
                callWithRetries(2, (): string => {
                    throw new Error('fail');
                }),
            {
                matchMessage: 'Retry max reached: fail',
            },
        );
    });
    it('fails with async callback', async () => {
        await assert.throws(
            () =>
                callWithRetries(2, async (): Promise<string> => {
                    await wait({milliseconds: 0});
                    throw new Error('fail');
                }),
            {
                matchMessage: 'Retry max reached: fail',
            },
        );
    });
});
