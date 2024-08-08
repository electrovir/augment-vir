import {describe} from '@augment-vir/test';
import {ensureError} from './ensure-error.js';

describe(ensureError.name, ({itCases}) => {
    const validError = new Error();

    class SubError extends Error {}
    const dateError = new SubError();

    itCases(ensureError, [
        {
            it: 'detects a valid error',
            input: validError,
            expect: validError,
        },
        {
            it: 'works with sub-errors',
            input: dateError,
            expect: dateError,
        },
        {
            it: 'returns error of given string',
            input: 'hello',
            expect: new Error('hello'),
        },
    ]);
});
