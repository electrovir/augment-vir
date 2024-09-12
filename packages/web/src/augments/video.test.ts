import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import Bowser from 'bowser';
import {loadVideo} from './video.js';

const bowser = Bowser.getParser(navigator.userAgent);

describe(loadVideo.name, () => {
    it('loads a video', async () => {
        /**
         * The following test works in every environment except WebKit on Windows in tests. However,
         * in those _Windows_ tests, `bowser.getOSName` still reports `'macOS'`, so we have to omit
         * Safari entirely.
         */
        if (bowser.getBrowserName() === 'Safari') {
            return;
        } else {
            assert.instanceOf(await loadVideo('/video.mock.webm'), HTMLVideoElement);
        }
    });
    it('rejects a missing video', async () => {
        await assert.throws(loadVideo('/missing.webm'));
    });
});
