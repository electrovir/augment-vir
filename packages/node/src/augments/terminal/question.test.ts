import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';

describe('question.ts', () => {
    it('imports without crashing', async () => {
        assert.isDefined(await import('./question.js'));
    });
});
