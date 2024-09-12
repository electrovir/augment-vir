import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {randomInteger} from './random-integer.js';

describe(randomInteger.name, () => {
    it('produces a number', () => {
        assert.isNumber(randomInteger({min: 0, max: 10}));
    });
    it('errors instead of crashing on too high of a number', () => {
        assert.throws(() => randomInteger({min: -999e305, max: 999e305}), {
            matchMessage: 'Cannot create a random integer so large',
        });
    });
    it('meets expected stats after a million calls', () => {
        let maxValue = -Infinity;
        let minValue = Infinity;
        let total = 0;
        for (let i = 0; i < 1_000_000; i++) {
            const result = randomInteger({min: 0, max: 10});
            if (result > maxValue) {
                maxValue = result;
            } else if (result < minValue) {
                minValue = result;
            }

            total += result;
        }

        const average = total / 1_000_000;

        assert.isAbove(minValue, -0.1);
        assert.isBelow(maxValue, 10.1);
        assert.isApproximately(
            average,
            5,
            0.5,
            `Average of '${average}' not close to the expected average.`,
        );
    });
});
