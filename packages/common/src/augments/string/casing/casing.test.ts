import {describe} from '@augment-vir/test';
import {hasCase, isCase, StringCaseEnum} from './casing.js';

describe(hasCase.name, ({itCases}) => {
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

describe(isCase.name, ({itCases}) => {
    itCases(isCase, [
        {
            it: 'passes a valid lower check',
            inputs: [
                'here',
                StringCaseEnum.Lower,
            ],
            expect: true,
        },
        {
            it: 'passes a valid upper check',
            inputs: [
                'HERE',
                StringCaseEnum.Upper,
            ],
            expect: true,
        },
        {
            it: 'fails an invalid check',
            inputs: [
                'here',
                StringCaseEnum.Upper,
            ],
            expect: false,
        },
        {
            it: 'fails a mixed check',
            inputs: [
                'heRe',
                StringCaseEnum.Upper,
            ],
            expect: false,
        },
        {
            it: 'normally allows an empty string',
            inputs: [
                '',
                StringCaseEnum.Upper,
            ],
            expect: true,
        },
        {
            it: 'fails an empty string if no case is blocked',
            inputs: [
                '',
                StringCaseEnum.Upper,
                {blockNoCaseCharacters: true},
            ],
            expect: false,
        },
        {
            it: 'normally allows an empty string',
            inputs: [
                '',
                StringCaseEnum.Upper,
            ],
            expect: true,
        },
    ]);
});
