import {assert, describe} from '@augment-vir/test';
import {copyThroughJson} from './copy-through-json.js';

describe(copyThroughJson.name, ({it}) => {
    it('should create an identical copy', () => {
        const testObjectA = {a: 5, b: 'five', c: {d: 5}, e: [6]};

        assert.deepStrictEqual(copyThroughJson(testObjectA), testObjectA);
    });
});
