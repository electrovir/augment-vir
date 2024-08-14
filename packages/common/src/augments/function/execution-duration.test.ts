import {assert, describe, it} from '@augment-vir/test';
import {wait} from '../promise/wait.js';
import {measureExecutionDuration} from './execution-duration.js';

describe(measureExecutionDuration.name, () => {
    it('measures the time', async () => {
        const waitDuration = 100;
        const measuredTime = await measureExecutionDuration(async () => {
            await wait(waitDuration);
        });

        assert.isAbove(measuredTime.milliseconds, waitDuration - 20);
    });

    it('has proper types', () => {
        assert.tsType(measureExecutionDuration(() => {})).equals<{milliseconds: number}>();
        assert
            .tsType(measureExecutionDuration(async () => {}))
            .equals<Promise<{milliseconds: number}>>();
        assert
            .tsType(measureExecutionDuration((): void | Promise<void> => {}))
            .equals<Promise<{milliseconds: number}> | {milliseconds: number}>();
    });
});
