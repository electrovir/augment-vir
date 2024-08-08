import {assert, describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {wait} from '../promise/wait.js';
import {measureExecutionDuration} from './execution-duration.js';

describe(measureExecutionDuration.name, ({it}) => {
    it('measures the time', async () => {
        const waitDuration = 100;
        const measuredTime = await measureExecutionDuration(async () => {
            await wait(waitDuration);
        });

        assert.isAbove(measuredTime.milliseconds, waitDuration - 20);
    });

    it('has proper types', () => {
        assertTypeOf(measureExecutionDuration(() => {})).toEqualTypeOf<{milliseconds: number}>();
        assertTypeOf(measureExecutionDuration(async () => {})).toEqualTypeOf<
            Promise<{milliseconds: number}>
        >();
        assertTypeOf(measureExecutionDuration((): void | Promise<void> => {})).toEqualTypeOf<
            Promise<{milliseconds: number}> | {milliseconds: number}
        >();
    });
});
