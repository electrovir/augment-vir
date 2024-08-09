import {assert, describe, it} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
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
        assertTypeOf(
            typedMap(
                [
                    '1',
                    '2',
                    '3',
                ],
                (entry) => toNumber(entry),
            ),
        ).toEqualTypeOf<[number, number, number]>();
    });
});
