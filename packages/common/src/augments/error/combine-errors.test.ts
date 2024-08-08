import {assert, describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {typedMap} from '../array/array-map.js';
import {combineErrorMessages, combineErrors} from './combine-errors.js';

describe(combineErrors.name, ({it}) => {
    it('has proper types', () => {
        assertTypeOf(combineErrors([])).toEqualTypeOf<Error | undefined>();
        assertTypeOf(combineErrors([new Error()])).toEqualTypeOf<Error>();

        assertTypeOf(
            combineErrors([
                new Error(),
                new Error(),
                new Error(),
            ]),
        ).toEqualTypeOf<Error>();

        const potentiallyEmptyErrorArray: Error[] = [];
        assertTypeOf(combineErrors(potentiallyEmptyErrorArray)).toEqualTypeOf<Error | undefined>();
    });

    it('combines multiple errors', () => {
        const errors = typedMap(
            [
                'this is error',
                'this is another error',
                'when will it end',
                'actually this is not many errors',
            ] as const,
            (message) => new Error(message),
        );

        const combinedErrors = combineErrors(errors);

        errors.forEach((error) => {
            assert.instanceOf(error, Error);
            assert.include(combinedErrors.message, error.message);
        });
    });
});

describe(combineErrorMessages.name, ({itCases}) => {
    itCases(combineErrorMessages, [
        {
            it: 'combines valid string messages',
            input: [
                'hello',
                'there',
                'how',
                'are',
                'you',
            ],
            expect: 'hello\nthere\nhow\nare\nyou',
        },
        {
            it: 'combines messages from errors',
            input: [
                new Error('hello'),
                new Error('there'),
                new Error('what'),
                new Error('do'),
                new Error('you'),
                new Error('want'),
            ],
            expect: 'hello\nthere\nwhat\ndo\nyou\nwant',
        },
        {
            it: 'ignores undefined or falsy inputs',
            input: [
                new Error('hello'),
                new Error('there'),
                undefined,
                new Error('do'),
                new Error('you'),
                '',
                new Error('want'),
            ],
            expect: 'hello\nthere\ndo\nyou\nwant',
        },
        {
            it: 'combines errors and strings',
            input: [
                new Error('hello'),
                new Error('there'),
                'I',
                'like',
                new Error('cheese'),
            ],
            expect: 'hello\nthere\nI\nlike\ncheese',
        },
        {
            it: 'returns nothing on empty array',
            input: [],
            expect: '',
        },
        {
            it: 'returns nothing on undefined',
            input: undefined,
            expect: '',
        },
        {
            it: 'returns nothing on no input',
            input: [],
            expect: '',
        },
    ]);
});
