import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {Debounce, DebounceStyle} from './debounce.js';
import {measureExecutionDuration} from './execution-duration.js';

describe(Debounce.name, () => {
    it('debounces first then wait style', async () => {
        const debounce = new Debounce(DebounceStyle.FirstThenWait, {
            milliseconds: 500,
        });
        let callCount = 0;
        debounce.execute(() => {
            callCount++;
        });
        debounce.execute(() => {
            callCount++;
        });
        assert.strictEquals(callCount, 1);
        const duration = await measureExecutionDuration(async () => {
            while (callCount <= 1) {
                debounce.execute(() => {
                    callCount++;
                });
                await wait({
                    milliseconds: 100,
                });
            }
        });
    });

    it('debounces after wait style', async () => {
        const debounce = new Debounce(DebounceStyle.AfterWait, {
            milliseconds: 500,
        });
        let callCount = 0;
        debounce.execute(() => {
            callCount++;
        });
        debounce.execute(() => {
            callCount++;
        });
        assert.strictEquals(callCount, 0);
        const duration = await measureExecutionDuration(async () => {
            while (callCount < 1) {
                debounce.execute(() => {
                    callCount++;
                });
                await wait({
                    milliseconds: 100,
                });
            }
        });
    });

    it('accepts a callback on construction', async () => {
        let callCount = 0;
        const debounce = new Debounce(
            DebounceStyle.AfterWait,
            {
                milliseconds: 500,
            },
            () => {
                ++callCount;
            },
        );
        debounce.execute();
        debounce.execute();
        assert.strictEquals(callCount, 0);
        const duration = await measureExecutionDuration(async () => {
            while (callCount < 1) {
                debounce.execute(() => {
                    callCount++;
                });
                await wait({
                    milliseconds: 100,
                });
            }
        });
    });
    it('debounces first then latest style', async () => {
        const debounce = new Debounce(DebounceStyle.FirstThenLatest, {
            milliseconds: 100,
        });
        const calls: string[] = [];
        debounce.execute(() => {
            calls.push('first');
        });
        debounce.execute(() => {
            calls.push('second');
        });
        debounce.execute(() => {
            calls.push('third');
        });
        assert.deepEquals(calls, [
            'first',
        ]);
        await wait({
            milliseconds: 150,
        });
        assert.deepEquals(calls, [
            'first',
            'third',
        ]);
    });
    it('fires a lone first then latest call only once', async () => {
        let callCount = 0;
        const debounce = new Debounce(
            DebounceStyle.FirstThenLatest,
            {
                milliseconds: 50,
            },
            () => {
                callCount++;
            },
        );
        debounce.execute();
        await wait({
            milliseconds: 100,
        });
        assert.strictEquals(callCount, 1);
    });
    it('skips execution if missing callback', () => {
        const debounce = new Debounce(DebounceStyle.FirstThenWait, {
            milliseconds: 500,
        });
        debounce.execute();
        debounce.execute();
        assert.strictEquals(debounce.nextCallTimestamp, 0);
        assert.isUndefined(debounce.callback);
    });
});
