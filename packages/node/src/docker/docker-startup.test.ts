import {describe, it} from '@augment-vir/test';
import {docker} from '../augments/docker.js';

describe('docker.start', () => {
    it('runs', async () => {
        await docker.start();
    });
});
