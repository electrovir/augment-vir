import {itCases} from '@augment-vir/chai';
import {extractErrorMessage, wait, wrapInTry} from '@augment-vir/common';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

type derp = Parameters<typeof wrapInTry>;

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

    it('types no options', () => {
        assertTypeOf(wrapInTry(() => 'hello', {})).toEqualTypeOf<Error | string>();
        assertTypeOf(wrapInTry(() => 'hello')).toEqualTypeOf<Error | string>();
        assertTypeOf(wrapInTry(async () => 'hello', {})).toEqualTypeOf<Promise<Error | string>>();
        assertTypeOf(wrapInTry(async () => 'hello')).toEqualTypeOf<Promise<Error | string>>();
    });
});
