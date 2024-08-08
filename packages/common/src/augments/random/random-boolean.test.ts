import {assert, describe} from '@augment-vir/test';
import {randomBoolean} from './random-boolean.js';

describe(randomBoolean.name, ({itCases}) => {
    itCases(
        (likelyTrue?: number) => {
            const counts = {
                true: 0,
                false: 0,
            };
            for (let i = 0; i < 1_000_000; i++) {
                if (randomBoolean(likelyTrue)) {
                    counts.true++;
                } else {
                    counts.false++;
                }
            }
            return (counts.true / (counts.true + counts.false)) * 100;
        },
        (actual, expected) => {
            assert.approximately(actual, expected, 0.5);
        },
        [
            {
                it: 'works with straight 50/50',
                input: 50,
                expect: 50,
            },
            {
                it: 'defaults to straight 50/50',
                input: undefined,
                expect: 50,
            },
            {
                it: 'clamps to 100',
                input: 5000,
                expect: 100,
            },
            {
                it: 'clamps to 0',
                input: -100,
                expect: 0,
            },
            {
                it: 'works with a different percentage',
                input: 39,
                expect: 39,
            },
        ],
    );
});
