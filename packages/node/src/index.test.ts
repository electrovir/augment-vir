import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';

describe('index.ts', () => {
    it('imports without crashing', async () => {
        assert.isDefined(await import('./index.js'));
    });
});
