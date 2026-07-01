import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {safeSplit, splitIncludeSplit} from './split.js';

describe(splitIncludeSplit.name, () => {
    itCases(splitIncludeSplit, [
        {
            it: 'splits by variable length RegExp matches',

            inputs: [
                'hello YoAaAaAu do you have some time for yoZzZu?',
                /yo.*?u/i,
                {
                    caseSensitive: false,
                },
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
                {
                    caseSensitive: false,
                },
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
            it: 'still splits like normal',
            input: {
                value: '1.2',
                splitter: '.',
            },
            expect: [
                '1',
                '2',
            ],
        },
    ]);

    it('has the correct types', () => {
        const [
            first,
            second,
        ] = safeSplit({
            value: '1.2',
            splitter: '.',
        });
        assert.tsType(first).equals<string>();
        assert.tsType(second).equals<string | undefined>();
    });
});
