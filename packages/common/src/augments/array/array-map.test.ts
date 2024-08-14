import {assert, describe, it} from '@augment-vir/test';
import {toNumber} from '../number/number-conversion.js';
import {typedMap} from './array-map.js';

describe(typedMap.name, () => {
    it('maps', () => {
        assert.deepStrictEqual(
            typedMap(
                [
                    '1',
                    '2',
                    '3',
                ],
                (entry) => toNumber(entry),
            ),
            [
                1,
                2,
                3,
            ],
        );
    });
    it('preserves tuple size', () => {
        assert
            .tsType(
                typedMap(
                    [
                        '1',
                        '2',
                        '3',
                    ],
                    (entry) => toNumber(entry),
                ),
            )
            .equals<[number, number, number]>();
    });
});
