import {assert} from '@augment-vir/assert';
import {log} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import Bowser from 'bowser';
import {loadVideo} from './video.js';

const bowser = Bowser.getParser(navigator.userAgent);

describe(loadVideo.name, () => {
    it('loads a video', async () => {
        log.debug({os: bowser.getOSName(), browser: bowser.getBrowserName()});

        /** This works in every environment except WebKit on Windows in tests. */
        if (bowser.getOSName() !== 'Windows' && bowser.getBrowserName() !== 'WebKit') {
            assert.instanceOf(await loadVideo('/video.mock.webm'), HTMLVideoElement);
        }
    });
    it('rejects a missing video', async () => {
        await assert.throws(loadVideo('/missing.webm'));
    });
});
