import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {repeatArray} from './repeat-array.js';

describe(repeatArray.name, () => {
    itCases(repeatArray, [
        {
            it: 'does nothing with an empty array',
            inputs: [
                5,
                [],
            ],
            expect: [],
        },
        {
            it: 'repeats the given array',
            inputs: [
                5,
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: [
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
            ],
        },
        {
            it: 'works with a decimal repeat value',
            inputs: [
                2.5,
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: [
                'a',
                'b',
                'c',
                'a',
                'b',
                'c',
            ],
        },
    ]);

    it('returns a new array', () => {
        const originalArray = [
            'a',
            'b',
            'c',
        ];
        const repeatedArray = repeatArray(2, originalArray);

        assert.isFalse(repeatedArray === originalArray);
        assert.notDeepEquals(repeatedArray, originalArray);
    });
});
