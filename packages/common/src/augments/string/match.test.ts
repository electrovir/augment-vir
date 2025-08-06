import {describe, itCases} from '@augment-vir/test';
import {match} from './match.js';

describe(match.name, () => {
    itCases(match, [
        {
            it: 'uses case insensitivity',
            inputs: [
                'BeEg',
                'eg',
            ],
            expect: true,
        },
        {
            it: 'matches',
            inputs: [
                'this is it',
                'it',
            ],
            expect: true,
        },
        {
            it: 'mismatches',
            inputs: [
                'this is it',
                'not',
            ],
            expect: false,
        },
    ]);
});
