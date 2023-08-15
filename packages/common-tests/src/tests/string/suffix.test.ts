import {itCases} from '@augment-vir/chai';
import {
    addPercent,
    addPx,
    addSuffix,
    removePercent,
    removePx,
    removeSuffix,
} from '@augment-vir/common';

describe(addPx.name, () => {
    itCases(addPx, [
        {
            it: 'adds px',
            input: '4',
            expect: '4px',
        },
        {
            it: 'adds px even to non numeric inputs',
            input: 'four-',
            expect: 'four-px',
        },
    ]);
});

describe(removePx.name, () => {
    itCases(removePx, [
        {
            it: 'removes px',
            input: '4px',
            expect: 4,
        },
        {
            it: 'fails if the input cannot be converted to a number',
            input: 'four-px',
            throws: Error,
        },
    ]);
});

describe(addPercent.name, () => {
    itCases(addPercent, [
        {
            it: 'adds percent',
            input: '4',
            expect: '4%',
        },
        {
            it: 'adds percent even to non numeric inputs',
            input: 'four-',
            expect: 'four-%',
        },
    ]);
});

describe(removePercent.name, () => {
    itCases(removePercent, [
        {
            it: 'removes percent',
            input: '4%',
            expect: 4,
        },
        {
            it: 'fails if the input cannot be converted to a number',
            input: 'four-px',
            throws: Error,
        },
    ]);
});

describe(addSuffix.name, () => {
    itCases(addSuffix, [
        {
            it: 'adds a simple suffix',
            inputs: [
                'stuff is here',
                ' and here',
            ],
            expect: 'stuff is here and here',
        },
    ]);
});

describe(removeSuffix.name, () => {
    itCases(removeSuffix, [
        {
            it: 'removes a simple suffix',
            inputs: [
                'stuff is here and here',
                ' and here',
            ],
            expect: 'stuff is here',
        },
    ]);
});
