import {assert} from '@open-wc/testing';
import {randomString} from './string';

describe(randomString.name, () => {
    it('should produce unique strings', () => {
        const randomStrings = Array(10)
            .fill(0)
            .map(() => {
                return randomString();
            });
        const randomStringSet = new Set(randomStrings);

        assert.strictEqual(
            randomStringSet.size,
            randomStrings.length,
            'some "random" strings were removed when converting to a set, meaning there were duplicates.',
        );
    });
});
