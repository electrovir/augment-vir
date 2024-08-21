import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {loadVideo} from './video.js';

describe(loadVideo.name, () => {
    it('loads a video', async () => {
        assert.instanceOf(await loadVideo('/video.mock.webm'), HTMLVideoElement);
    });
    it('rejects a missing video', async () => {
        await assert.throws(loadVideo('/missing.webm'));
    });
});
