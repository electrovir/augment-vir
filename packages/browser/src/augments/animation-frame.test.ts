import {timeCallback} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {waitForAnimationFrame} from './animation-frame';

describe(waitForAnimationFrame.name, () => {
    it('waits for a non-zero amount of time', async () => {
        const singleFrameDuration = await timeCallback(() => waitForAnimationFrame(2));
        const multipleFrameDuration = await timeCallback(() => waitForAnimationFrame(20));

        /** These tests are intentionally lenient: CI runners have issues with timing. */
        assert.isAbove(singleFrameDuration, 0);
        assert.isAbove(multipleFrameDuration, singleFrameDuration);
    });
});
