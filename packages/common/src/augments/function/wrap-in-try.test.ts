import {assert} from '@augment-vir/assert';
import {extractErrorMessage, wait} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {wrapInTry} from './wrap-in-try.js';

describe(wrapInTry.name, () => {
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
                    handleError(error) {
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
                    await wait({milliseconds: 1});
                    throw new Error('yikes');
                },
                {fallbackValue: 'got the fallbackValue'},
            ],
            expect: 'got the fallbackValue',
        },
        {
            it: 'works with async callback and handle error',
            inputs: [
                async () => {
                    await wait({milliseconds: 1});
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
        {
            it: 'works with async callback',
            inputs: [
                async () => {
                    await wait({milliseconds: 1});
                    throw new Error('yikes');
                },
            ],
            expect: new Error('yikes'),
        },
    ]);

    it('allows an undefined fallback value type', () => {
        assert
            .tsType(wrapInTry(() => 'yo', {fallbackValue: undefined}))
            .equals<string | undefined>();
    });

    it('types no options', () => {
        assert.tsType(wrapInTry(() => 'hello', {})).equals<Error | string>();
        assert.tsType(wrapInTry(() => 'hello')).equals<Error | string>();
        assert
            .tsType(
                wrapInTry(async () => {
                    await wait({milliseconds: 0});
                    return 'hello';
                }, {}),
            )
            .equals<Promise<Error | string>>();
        assert
            .tsType(
                wrapInTry(async () => {
                    await wait({milliseconds: 0});
                    return 'hello';
                }),
            )
            .equals<Promise<Error | string>>();
    });
});
