import {itCases} from '@augment-vir/chai';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {
    combineErrorMessages,
    combineErrors,
    ensureError,
    executeAndReturnError,
    extractErrorMessage,
    InvalidDateError,
    typedMap,
    wait,
} from '../../../common/src';

describe(extractErrorMessage.name, () => {
    it('should extract message from error object', () => {
        expect(extractErrorMessage(new Error('hello there'))).to.equal('hello there');
    });

    it('should return empty string for falsy inputs', () => {
        expect(extractErrorMessage(undefined)).to.equal('');
        expect(extractErrorMessage(null)).to.equal('');
        expect(extractErrorMessage(false)).to.equal('');
    });

    it('should return a string for other inputs', () => {
        expect(extractErrorMessage(54621)).to.equal('54621');
    });

    it('should return a string for strings', () => {
        expect(extractErrorMessage('just a string')).to.equal('just a string');
    });
});

describe(combineErrors.name, () => {
    it('should pass type tests', () => {
        function acceptOnlyError(input: Error): void {}

        // verify that an empty array results in undefined as the return type
        // @ts-expect-error
        acceptOnlyError(combineErrors([]));

        // verify that no array results in an undefined return type
        // @ts-expect-error
        acceptOnlyError(combineErrors());

        // verify that undefined results in an undefined return type
        // @ts-expect-error
        acceptOnlyError(combineErrors(undefined));

        // verify that an array with Error instances results in an Error return type
        acceptOnlyError(combineErrors([new Error()]));

        acceptOnlyError(
            combineErrors([
                new Error(),
                new Error(),
                new Error(),
            ]),
        );

        // verify that a potentially empty Error array results in an Error|undefined return type
        const potentiallyEmptyErrorArray: Error[] = [];
        // @ts-expect-error
        acceptOnlyError(combineErrors(potentiallyEmptyErrorArray));
    });

    it('should combine multiple errors', () => {
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
            assert.include(combinedErrors.message, error.message);
        });
    });
});

describe(combineErrorMessages.name, () => {
    itCases(combineErrorMessages, [
        {
            it: 'should combine valid string messages',
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
            it: 'should combine messages from errors',
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
            it: 'should ignore undefined or falsy inputs',
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
            it: 'should combine errors and strings',
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
            it: 'should return nothing if empty array is given',
            input: [],
            expect: '',
        },
        {
            it: 'should return nothing if undefined is given',
            input: undefined,
            expect: '',
        },
        {
            it: 'should return nothing no input is given',
            input: [],
            expect: '',
        },
    ]);
});

describe(ensureError.name, () => {
    const validError = new Error();
    const dateError = new InvalidDateError();

    itCases(ensureError, [
        {
            it: 'should detect a valid error',
            input: validError,
            expect: validError,
        },
        {
            it: 'should work with sub-errors',
            input: dateError,
            expect: dateError,
        },
        {
            it: 'should return error of given string',
            input: 'hello',
            expect: new Error('hello'),
        },
    ]);
});

describe(executeAndReturnError.name, () => {
    it('should have correct return types', async () => {
        const syncResult: Error | void = executeAndReturnError(() => {});
        const asyncResult: Promise<Error | void> = executeAndReturnError(async () => {});
    });

    itCases(executeAndReturnError, [
        {
            it: 'should return undefined if no error is thrown',
            input: () => {},
            expect: undefined,
        },
        {
            it: 'should handle an async input without errors',
            input: async () => {
                await wait(0);
            },
            expect: undefined,
        },
        {
            it: 'should catch a synchronous error',
            input: () => {
                throw new Error('test error');
            },
            expect: new Error('test error'),
        },
        {
            it: 'should catch an asynchronous error',
            input: async () => {
                await wait(0);
                throw new Error('test error');
            },
            expect: new Error('test error'),
        },
    ]);
});
