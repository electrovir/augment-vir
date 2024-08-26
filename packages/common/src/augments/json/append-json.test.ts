import {describe, itCases} from '@augment-vir/test';
import {appendJson} from './append-json.js';

describe(appendJson.name, () => {
    itCases(appendJson, [
        {
            it: 'converts first raw string into an array',
            inputs: [
                'a',
                ['b'],
            ],
            expect: [
                'a',
                'b',
            ],
        },
        {
            it: 'appends subsequent raw strings into an array',
            inputs: [
                'a',
                'b',
            ],
            expect: [
                'a',
                'b',
            ],
        },
        {
            it: 'appends an object into an array',
            inputs: [
                'a',
                {a: 'b'},
            ],
            expect: [
                'a',
                {a: 'b'},
            ],
        },
        {
            it: 'appends a string into an object',
            inputs: [
                {a: 'b'},
                'a',
            ],
            expect: {
                a: 'b',
                '0': 'a',
            },
        },
    ]);
});
