import {timeCallback} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {waitForAnimationFrame} from './animation-frame';

describe(waitForAnimationFrame.name, () => {
    it('waits for a non-zero amount of time', async () => {
        const singleFrameDuration = await timeCallback(waitForAnimationFrame);
        const multipleFrameDuration = await timeCallback(() => waitForAnimationFrame(5));

        assert.isAbove(singleFrameDuration, 1);
        assert.isAbove(multipleFrameDuration, singleFrameDuration * 3);
    });
});
