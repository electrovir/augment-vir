import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {docker} from '../augments/docker.js';
import {runMockLongLivingContainer} from './containers/run-container.mock.js';

/**
 * Using Alpine Linux because it's so small.
 *
 * https://hub.docker.com/_/alpine/tags
 *
 * This version must be different than the one used in {@link runMockLongLivingContainer} to prevent
 * this test messing up all the others.
 */
export const testDockerImageName = 'alpine:3.19.3';

describe('docker.image', () => {
    it('updates and removes', async () => {
        await docker.image.remove(testDockerImageName);
        assert.isFalse(await docker.image.exists(testDockerImageName));
        await docker.image.update(testDockerImageName);
        assert.isTrue(await docker.image.exists(testDockerImageName));
        await docker.image.update(testDockerImageName);
    });
    it('ignores removing already missing images', async () => {
        await docker.image.remove('electrovir-fake-image-name:123.456.0789');
    });
});
