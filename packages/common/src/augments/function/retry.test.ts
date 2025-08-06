import {assert} from '@augment-vir/assert';
import {wait, type MaybePromise} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {retry} from './retry.js';

describe(retry.name, () => {
    it('has proper types', async () => {
        const result = retry(2, () => true);
        assert.tsType(result).equals<boolean>();
        const resultWithInterval = retry(2, () => true, {interval: {milliseconds: 1}});
        assert.tsType(resultWithInterval).equals<Promise<boolean>>();
        await resultWithInterval;

        const promiseResult = retry(2, async () => {
            await wait({milliseconds: 0});
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
    it('retries with async callback', async () => {
        let counter = 0;
        const result = await retry(2, async () => {
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
                retry(2, (): string => {
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
                retry(2, async (): Promise<string> => {
                    await wait({milliseconds: 0});
                    throw new Error('fail');
                }),
            {
                matchMessage: 'Retry max reached: fail',
            },
        );
    });
});
