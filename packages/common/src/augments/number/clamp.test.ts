import {describe} from '@augment-vir/test';
import {clamp} from './clamp.js';

describe(clamp.name, ({itCases}) => {
    itCases(clamp, [
        {
            it: 'does not alter a within-range value',
            inputs: [
                42,
                {
                    max: 50,
                    min: 40,
                },
            ],
            expect: 42,
        },
        {
            it: 'clamps a too high number',
            inputs: [
                1000,
                {
                    max: 50,
                    min: 40,
                },
            ],
            expect: 50,
        },
        {
            it: 'clamps a too low number',
            inputs: [
                20,
                {
                    max: 50,
                    min: 40,
                },
            ],
            expect: 40,
        },
    ]);
});
