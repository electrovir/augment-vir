import {extractErrorMessage} from '@augment-vir/core';
import {describe, itCases} from '@augment-vir/test';
import {AssertionError} from './assertion.error.js';

describe(AssertionError.name, () => {
    function testAssertionError(baseMessage: string, userCustomizedMessage?: undefined | string) {
        return extractErrorMessage(new AssertionError(baseMessage, userCustomizedMessage));
    }

    itCases(testAssertionError, [
        {
            it: 'combines messages',
            inputs: [
                'base',
                'custom',
            ],
            expect: 'custom: base',
        },
        {
            it: 'ignores missing custom message',
            inputs: [
                'base',
            ],
            expect: 'base',
        },
        {
            it: 'has a fallback message if both are empty',
            inputs: [
                '',
                '',
            ],
            expect: 'Assertion failed.',
        },
    ]);
});
