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
                await wait({milliseconds: 100});
            }
        });
        assert.isAbove(duration.milliseconds, 450);
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
                await wait({milliseconds: 100});
            }
        });
        assert.isAbove(duration.milliseconds, 450);
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
                await wait({milliseconds: 100});
            }
        });
        assert.isAbove(duration.milliseconds, 450);
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
