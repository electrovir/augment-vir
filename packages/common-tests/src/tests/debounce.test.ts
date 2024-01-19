import {DebounceStyle, createDebounce, timeCallback, waitUntilTruthy} from '@augment-vir/common';
import {assert} from 'chai';

describe(createDebounce.name, () => {
    it('debounces first then wait style', async () => {
        const debounced = createDebounce(DebounceStyle.FirstThenWait, {milliseconds: 500});
        let callCount = 0;
        debounced(() => {
            callCount++;
        });
        debounced(() => {
            callCount++;
        });
        assert.strictEqual(callCount, 1);
        const duration = await timeCallback(async () => {
            await waitUntilTruthy(() => {
                debounced(() => {
                    callCount++;
                });
                return callCount > 1;
            });
        });
        assert.isAbove(duration, 450);
    });

    it('debounces after wait style', async () => {
        const debounced = createDebounce(DebounceStyle.AfterWait, {milliseconds: 500});
        let callCount = 0;
        debounced(() => {
            callCount++;
        });
        debounced(() => {
            callCount++;
        });
        assert.strictEqual(callCount, 0);
        const duration = await timeCallback(async () => {
            await waitUntilTruthy(() => {
                debounced(() => {
                    callCount++;
                });
                return callCount > 0;
            });
        });
        assert.isAbove(duration, 450);
    });
});
