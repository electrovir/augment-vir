import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {sortObject} from './object-sort.js';

describe(sortObject.name, () => {
    const outOfOrder = {z: 4, c: 3, a: 1, b: 2};

    it('does not mutate the original object', () => {
        assert.deepEquals(
            Object.keys(outOfOrder),
            [
                'z',
                'c',
                'a',
                'b',
            ],
            'should have initial key ordering',
        );
        const sorted = sortObject(outOfOrder);
        assert.deepEquals(sorted, outOfOrder, 'sorted should equal original');
        assert.tsType(sorted).equals(outOfOrder);
        assert.deepEquals(
            Object.keys(sorted),
            [
                'a',
                'b',
                'c',
                'z',
            ],
            'keys should be sorted now',
        );
        assert.deepEquals(
            Object.keys(outOfOrder),
            [
                'z',
                'c',
                'a',
                'b',
            ],
            'original keys still should not be sorted',
        );
    });
});
