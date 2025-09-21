import {describe, itCases} from '@augment-vir/test';
import {indent} from './indent.js';

describe(indent.name, () => {
    itCases(indent, [
        {
            it: 'indents a single line',
            inputs: ['hi'],
            expect: '    hi',
        },
        {
            it: 'indents multiple lines',
            inputs: ['hi\nbye'],
            expect: '    hi\n    bye',
        },
        {
            it: 'indents multiple times',
            inputs: [
                'hi\nbye',
                2,
            ],
            expect: '        hi\n        bye',
        },
    ]);
});
