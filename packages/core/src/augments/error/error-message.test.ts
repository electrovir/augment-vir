import {describe, itCases} from '@augment-vir/test';
import {combineErrorMessages, extractErrorMessage} from './error-message.js';

describe(extractErrorMessage.name, () => {
    itCases(extractErrorMessage, [
        {
            it: 'extracts from an error',
            input: new Error('message a'),
            expect: 'message a',
        },
        {
            it: 'extracts from an object with a message',
            input: {message: 'message a'},
            expect: 'message a',
        },
        {
            it: 'extracts from a string',
            input: 'message a',
            expect: 'message a',
        },
        {
            it: 'tries its best on a different type',
            input: ['message a'],
            expect: "['message a']",
        },
        {
            it: 'handles a falsy value',
            input: undefined,
            expect: '',
        },
    ]);
});

describe(combineErrorMessages.name, () => {
    itCases(combineErrorMessages, [
        {
            it: 'combines messages',
            inputs: [
                'a',
                'b',
                'c',
            ],
            expect: 'a: b: c',
        },
        {
            it: 'removes punctuation',
            inputs: [
                'a.',
                'b.',
                'c.',
            ],
            expect: 'a: b: c.',
        },
        {
            it: 'filters empty messages',
            inputs: [
                'a.',
                '',
                '',
            ],
            expect: 'a.',
        },
        {
            it: 'filters empty punctuation messages',
            inputs: [
                'a.',
                '',
                '.',
            ],
            expect: 'a.',
        },
        {
            it: 'handles all empty messages',
            inputs: [
                '',
                '',
            ],
            expect: '',
        },
        {
            it: 'handles all empty messages with punctuation',
            inputs: [
                '',
                '.',
            ],
            expect: '',
        },
        {
            it: 'handles all empty messages with punctuation',
            inputs: [
                '',
                '.',
            ],
            expect: '',
        },
    ]);
});
