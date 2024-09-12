import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {measureExecutionDuration} from './execution-duration.js';

describe(measureExecutionDuration.name, () => {
    it('measures the time', async () => {
        const waitDuration = 100;
        const measuredTime = await measureExecutionDuration(async () => {
            await wait({milliseconds: waitDuration});
        });

        assert.isAbove(measuredTime.milliseconds, waitDuration - 20);
    });

    it('passes through a promise rejects', async () => {
        await assert.throws(
            measureExecutionDuration(async () => {
                await wait({milliseconds: 0});
                throw new Error('hi');
            }),
        );
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
