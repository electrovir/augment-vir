import {describe} from '@augment-vir/test';
import {collapseWhiteSpace} from './white-space.js';

describe(collapseWhiteSpace.name, ({itCases}) => {
    itCases(collapseWhiteSpace, [
        {
            it: 'works with single repeating spaces',
            inputs: ['hello           there'],
            expect: 'hello there',
        },
        {
            it: 'works with multiple repeating spaces',
            inputs: ['hello           there          you        are a bold           one'],
            expect: 'hello there you are a bold one',
        },
        {
            it: 'also trims',
            inputs: ['     hello   there     '],
            expect: 'hello there',
        },
        {
            it: 'collapses newlines by default',
            inputs: ['   \n  hello \n  there   \n\n  '],
            expect: 'hello there',
        },
        {
            it: 'can preserve newlines',
            inputs: [
                '   \n  hello \n  there   \n\n  ',
                {
                    keepNewLines: true,
                },
            ],
            expect: 'hello\nthere',
        },
        {
            it: 'replaces tabs with spaces',
            inputs: [
                'hello\tthere',
            ],
            expect: 'hello there',
        },
    ]);
});
