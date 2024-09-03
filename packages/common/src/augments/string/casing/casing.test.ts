import {describe, itCases} from '@augment-vir/test';
import {hasCase, isCase, StringCase} from './casing.js';

describe(hasCase.name, () => {
    itCases(hasCase, [
        {
            it: 'allows a normal letter',
            input: 'a',
            expect: true,
        },
        {
            it: 'rejects numbers',
            input: '2',
            expect: false,
        },
        {
            it: 'rejects punctuation',
            input: '-',
            expect: false,
        },
        {
            it: 'works with accented letter',
            input: 'á',
            expect: true,
        },
        {
            it: 'rejects an empty string',
            input: '',
            expect: false,
        },
    ]);
});

describe(isCase.name, () => {
    itCases(isCase, [
        {
            it: 'passes a valid lower check',
            inputs: [
                'here',
                StringCase.Lower,
            ],
            expect: true,
        },
        {
            it: 'passes a valid upper check',
            inputs: [
                'HERE',
                StringCase.Upper,
            ],
            expect: true,
        },
        {
            it: 'fails an invalid check',
            inputs: [
                'here',
                StringCase.Upper,
            ],
            expect: false,
        },
        {
            it: 'fails a mixed check',
            inputs: [
                'heRe',
                StringCase.Upper,
            ],
            expect: false,
        },
        {
            it: 'normally allows an empty string',
            inputs: [
                '',
                StringCase.Upper,
            ],
            expect: true,
        },
        {
            it: 'fails an empty string if no case is blocked',
            inputs: [
                '',
                StringCase.Upper,
                {rejectNoCaseCharacters: true},
            ],
            expect: false,
        },
        {
            it: 'fails letter with no case',
            inputs: [
                '√',
                StringCase.Upper,
                {rejectNoCaseCharacters: true},
            ],
            expect: false,
        },
        {
            it: 'passes letter with no case',
            inputs: [
                '√',
                StringCase.Upper,
            ],
            expect: true,
        },
    ]);
});
