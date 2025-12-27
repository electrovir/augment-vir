import {describe, itCases} from '@augment-vir/test';
import {trimAndSplitLines, trimLines} from './lines.js';

describe(trimLines.name, () => {
    itCases(trimLines, [
        {
            it: 'trims lines',
            input: '   hi  \n   bye   \n\n abc',
            expect: 'hi\nbye\nabc',
        },
        {
            it: 'has no effect if nothing to trim',
            input: 'hi\nbye\nabc',
            expect: 'hi\nbye\nabc',
        },
    ]);
});

describe(trimAndSplitLines.name, () => {
    itCases(trimAndSplitLines, [
        {
            it: 'trims and splits lines',
            input: '   hi  \n   bye   \n\n abc',
            expect: [
                'hi',
                'bye',
                'abc',
            ],
        },
        {
            it: 'still splits if nothing to trim',
            input: 'hi\nbye\nabc',
            expect: [
                'hi',
                'bye',
                'abc',
            ],
        },
    ]);
});
