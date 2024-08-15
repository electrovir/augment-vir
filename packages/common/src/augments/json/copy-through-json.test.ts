import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {copyThroughJson} from './copy-through-json.js';

describe(copyThroughJson.name, () => {
    it('should create an identical copy', () => {
        const testObjectA = {a: 5, b: 'five', c: {d: 5}, e: [6]};

        assert.deepEquals(copyThroughJson(testObjectA), testObjectA);
    });
});
