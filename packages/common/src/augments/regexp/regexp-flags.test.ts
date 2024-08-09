import {describe, itCases} from '@augment-vir/test';
import {addRegExpFlags, deDupeRegExFlags} from './regexp-flags.js';

describe(deDupeRegExFlags.name, () => {
    itCases(deDupeRegExFlags, [
        {
            it: 'deDupes consecutive flags',
            input: 'iIiIgGgG',
            expect: 'ig',
        },
        {
            it: 'deDupes nonconsecutive flags',
            input: 'igIgI',
            expect: 'ig',
        },
    ]);
});

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
