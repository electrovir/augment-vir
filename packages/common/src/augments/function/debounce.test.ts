import {assert, describe, it} from '@augment-vir/test';
import {wait} from '../promise/wait.js';
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
        assert.areStrictEqual(callCount, 1);
        const duration = await measureExecutionDuration(async () => {
            while (callCount <= 1) {
                debounce.execute(() => {
                    callCount++;
                });
                await wait(100);
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
        assert.areStrictEqual(callCount, 0);
        const duration = await measureExecutionDuration(async () => {
            while (callCount < 1) {
                debounce.execute(() => {
                    callCount++;
                });
                await wait(100);
            }
        });
        assert.isAbove(duration.milliseconds, 450);
    });
});
