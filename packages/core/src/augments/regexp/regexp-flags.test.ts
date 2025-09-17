import {describe, itCases} from '@augment-vir/test';
import {addRegExpFlags, setRegExpCaseSensitivity, setRegExpFlags} from './regexp-flags.js';

describe(addRegExpFlags.name, () => {
    function testAddingRegExpFlags(...args: Parameters<typeof addRegExpFlags>) {
        const regExp = addRegExpFlags(...args);
        return regExp.flags;
    }

    itCases(testAddingRegExpFlags, [
        {
            it: 'adds flags to a RegExp',
            inputs: [
                /nothing to see here/,
                'i',
            ],
            expect: 'i',
        },
        {
            it: 'works with a string',
            inputs: [
                'nothing to see here',
                'i',
            ],
            expect: 'i',
        },
        {
            it: 'does not duplicate flags',
            inputs: [
                /nothing to see here/i,
                'i',
            ],
            expect: 'i',
        },
        {
            it: 'preserves original flags',
            inputs: [
                /nothing to see here/g,
                'i',
            ],
            expect: 'gi',
        },
    ]);
});

describe(setRegExpFlags.name, () => {
    function testSettingRegExpFlags(...args: Parameters<typeof setRegExpFlags>) {
        const regExp = setRegExpFlags(...args);
        return regExp.flags;
    }

    itCases(testSettingRegExpFlags, [
        {
            it: 'adds flags to a RegExp',
            inputs: [
                /nothing to see here/,
                'i',
            ],
            expect: 'i',
        },
        {
            it: 'works with a string',
            inputs: [
                'nothing to see here',
                'i',
            ],
            expect: 'i',
        },
        {
            it: 'does not duplicate flags',
            inputs: [
                /nothing to see here/i,
                'i',
            ],
            expect: 'i',
        },
        {
            it: 'overwrites original flags',
            inputs: [
                /nothing to see here/g,
                'i',
            ],
            expect: 'i',
        },
    ]);
});

describe(setRegExpCaseSensitivity.name, () => {
    function testSettingRegExpCaseSensitivity(
        ...args: Parameters<typeof setRegExpCaseSensitivity>
    ) {
        const regExp = setRegExpCaseSensitivity(...args);
        return regExp.flags;
    }

    itCases(testSettingRegExpCaseSensitivity, [
        {
            it: 'sets case insensitive',
            inputs: [
                /nothing to see here/,
                {caseSensitive: false},
            ],
            expect: 'i',
        },
        {
            it: 'removes case insensitive flag',
            inputs: [
                /nothing to see here/gi,
                {caseSensitive: true},
            ],
            expect: 'g',
        },
        {
            it: 'does not duplicate i flag',
            inputs: [
                /nothing to see here/i,
                {caseSensitive: false},
            ],
            expect: 'i',
        },
        {
            it: 'preserves existing flags',
            inputs: [
                /nothing to see here/g,
                {caseSensitive: false},
            ],
            expect: 'gi',
        },
        {
            it: 'works with a string',
            inputs: [
                'nothing to see here',
                {caseSensitive: false},
            ],
            expect: 'i',
        },
    ]);
});
