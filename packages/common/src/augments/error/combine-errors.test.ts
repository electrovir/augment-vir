import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {typedMap} from '../array/array-map.js';
import {combineErrors} from './combine-errors.js';

describe(combineErrors.name, () => {
    it('has proper types', () => {
        assert.tsType(combineErrors([])).equals<Error | undefined>();
        assert.tsType(combineErrors([new Error()])).equals<Error>();

        assert
            .tsType(
                combineErrors([
                    new Error(),
                    new Error(),
                    new Error(),
                ]),
            )
            .equals<Error>();

        const potentiallyEmptyErrorArray: Error[] = [];
        assert.tsType(combineErrors(potentiallyEmptyErrorArray)).equals<Error | undefined>();
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
            assert.isIn(error.message, combinedErrors.message);
        });
    });
});
