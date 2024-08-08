import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {extractErrorMessage} from '../error/error-message.js';
import {wait} from '../promise/wait.js';
import {wrapInTry} from './wrap-in-try.js';

describe(wrapInTry.name, ({itCases, it}) => {
    itCases(wrapInTry<any, any>, [
        {
            it: 'returns the callback return if it does not error',
            inputs: [
                () => 'success!',
                {},
            ],
            expect: 'success!',
        },
        {
            it: 'returns the Error if the callback does error',
            inputs: [
                () => {
                    throw new Error('errored');
                },
                {},
            ],
            expect: new Error('errored'),
        },
        {
            it: 'returns the fallback if the callback does error',
            inputs: [
                () => {
                    throw new Error('errored');
                },
                {
                    fallbackValue: 'failed',
                },
            ],
            expect: 'failed',
        },
        {
            it: 'allows an undefined fallback',
            inputs: [
                () => {
                    throw new Error('errored');
                },
                {
                    fallbackValue: undefined,
                },
            ],
            expect: undefined,
        },
        {
            it: 'calls handleError if the callback does error',
            inputs: [
                () => {
                    throw new Error('errored');
                },
                {
                    handleError() {
                        return 'got the catchCallback';
                    },
                },
            ],
            expect: 'got the catchCallback',
        },
        {
            it: 'works with async callbacks and a fallback',
            inputs: [
                async () => {
                    await wait(1);
                    throw new Error('yikes');
                },
                {fallbackValue: 'got the fallbackValue'},
            ],
            expect: 'got the fallbackValue',
        },
        {
            it: 'works with async callback',
            inputs: [
                async () => {
                    await wait(1);
                    throw new Error('yikes');
                },
                {
                    handleError(error) {
                        return `got the error: ${extractErrorMessage(error)}`;
                    },
                },
            ],
            expect: 'got the error: yikes',
        },
    ]);

    it('allows an undefined fallback value type', () => {
        assertTypeOf(wrapInTry(() => 'yo', {fallbackValue: undefined})).toEqualTypeOf<
            string | undefined
        >();
    });

    it('correctly types no options', () => {
        assertTypeOf(wrapInTry(() => 'hello', {})).toEqualTypeOf<Error | string>();
        assertTypeOf(wrapInTry(() => 'hello')).toEqualTypeOf<Error | string>();
        assertTypeOf(wrapInTry(async () => Promise.resolve('hello'), {})).toEqualTypeOf<
            Promise<Error | string>
        >();
        assertTypeOf(wrapInTry(async () => Promise.resolve('hello'))).toEqualTypeOf<
            Promise<Error | string>
        >();
    });
    it('correctly types a fallback option', () => {
        assertTypeOf(wrapInTry(() => 'hello', {fallbackValue: 4})).toEqualTypeOf<number | string>();
        assertTypeOf(
            wrapInTry(async () => Promise.resolve('hello'), {fallbackValue: 4}),
        ).toEqualTypeOf<Promise<number | string>>();
        assertTypeOf(
            wrapInTry(() => 'hello', {
                handleError() {
                    return 4;
                },
            }),
        ).toEqualTypeOf<number | string>();
        assertTypeOf(
            wrapInTry(async () => Promise.resolve('hello'), {
                handleError() {
                    return 4;
                },
            }),
        ).toEqualTypeOf<Promise<number | string>>();
    });
});
