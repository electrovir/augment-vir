import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {type AnyObject} from './generic-object-type.js';
import {sortObject} from './object-sort.js';

describe(sortObject.name, () => {
    const outOfOrder = {
        z: 4,
        c: 3,
        a: 1,
        b: 2,
    };

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

    it('handles a recursive object', () => {
        const recursiveObject: AnyObject = {
            c: 3,
            a: 1,
            b: 2,
        };

        recursiveObject.b = recursiveObject;

        sortObject(recursiveObject);
    });

    itCases(
        sortObject,
        (actual, expected) => assert.strictEquals(JSON.stringify(actual), JSON.stringify(expected)),
        [
            {
                it: 'sorts',
                inputs: [
                    {
                        c: 3,
                        b: 2,
                        a: 1,
                    },
                ],
                expect: {
                    a: 1,
                    b: 2,
                    c: 3,
                },
            },
            {
                it: 'sorts recursively',
                inputs: [
                    {
                        c: 5,
                        b: 4,
                        a: {
                            s: 3,
                            q: 1,
                            r: 2,
                        },
                    },
                ],
                expect: {
                    a: {
                        q: 1,
                        r: 2,
                        s: 3,
                    },
                    b: 4,
                    c: 5,
                },
            },
            {
                it: 'uses custom comparison',
                inputs: [
                    {
                        a: 1,
                        b: 2,
                        c: 3,
                    },
                    (a, b) => b.value - a.value,
                ],
                expect: {
                    c: 3,
                    b: 2,
                    a: 1,
                },
            },
        ],
    );
});
