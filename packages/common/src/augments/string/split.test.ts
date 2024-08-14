import {describe, it, itCases} from '@augment-vir/test';
import {assert} from 'run-time-assertions';
import {safeSplit, splitIncludeSplit} from './split.js';

describe(splitIncludeSplit.name, () => {
    itCases(splitIncludeSplit, [
        {
            it: 'splits by variable length RegExp matches',

            inputs: [
                'hello YoAaAaAu do you have some time for yoZzZu?',
                /yo.*?u/i,
                false,
            ],
            expect: [
                'hello ',
                'YoAaAaAu',
                ' do ',
                'you',
                ' have some time for ',
                'yoZzZu',
                '?',
            ],
        },
        {
            it: 'splits by a simple string',

            inputs: [
                'hello You do you have some time for you?',
                'you',
                false,
            ],
            expect: [
                'hello ',
                'You',
                ' do ',
                'you',
                ' have some time for ',
                'you',
                '?',
            ],
        },
    ]);
});

describe(safeSplit.name, () => {
    itCases(safeSplit, [
        {
            it: 'should still split like normal',
            inputs: [
                '1.2',
                '.',
            ],
            expect: [
                '1',
                '2',
            ],
        },
    ]);

    it('should have the correct types', () => {
        const [
            first,
            second,
        ] = safeSplit('1.2', '.');
        assert.tsType(first).equals<string>();
        assert.tsType(second).equals<string | undefined>();
    });
});
