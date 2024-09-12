import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {loadImage} from './image.js';

describe(loadImage.name, () => {
    it('loads an image', async () => {
        assert.instanceOf(await loadImage('/bolt-272.mock.png'), HTMLImageElement);
    });
    it('rejects a missing image', async () => {
        await assert.throws(loadImage('/missing.png'));
    });
});
