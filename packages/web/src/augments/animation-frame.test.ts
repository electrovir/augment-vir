import {assert} from '@augment-vir/assert';
import {measureExecutionDuration} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {waitForAnimationFrame} from './animation-frame.js';

describe(waitForAnimationFrame.name, () => {
    it('waits for a non-zero amount of time', async () => {
        const singleFrameDuration = await measureExecutionDuration(() => waitForAnimationFrame(2));
        const multipleFrameDuration = await measureExecutionDuration(() =>
            waitForAnimationFrame(20),
        );

        /** These tests are intentionally lenient: CI runners have issues with timing. */
        assert.isAbove(singleFrameDuration.milliseconds, 0);
        assert.isAbove(multipleFrameDuration.milliseconds, singleFrameDuration.milliseconds);
    });
});
