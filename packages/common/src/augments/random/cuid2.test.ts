import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {isCuid} from '@paralleldrive/cuid2';
import {createCuid2} from './cuid2.js';

describe(createCuid2.name, () => {
    it('produces a valid cuid2', () => {
        assert.isTrue(isCuid(createCuid2()));
    });
    it('produces unique values', () => {
        const ids = new Array(100).fill(0).map(() => createCuid2());
        assert.strictEquals(new Set(ids).size, ids.length);
    });
});
