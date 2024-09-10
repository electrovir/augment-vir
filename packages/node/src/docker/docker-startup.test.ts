import {describe, it} from '@augment-vir/test';
import {docker} from '../augments/docker.js';
import {dockerTest} from './run-docker-test.mock.js';

describe(
    'docker.start',
    dockerTest(() => {
        it('runs', async () => {
            await docker.start();
        });
    }),
);
