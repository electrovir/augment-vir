import {describe, itCases} from '@augment-vir/test';
import {waitUntilTestOptions} from '../test-timeout.mock.js';
import {parseWaitUntilArgs, type WaitUntilOptions} from './wait-until-function.js';

describe(parseWaitUntilArgs.name, () => {
    const callback1 = () => {
        return 'hi';
    };

    itCases(parseWaitUntilArgs, [
        {
            it: 'works',
            input: [
                callback1,
                waitUntilTestOptions satisfies WaitUntilOptions,
                'failure',
            ],
            expect: {
                callback: callback1,
                extraAssertionArgs: [],
                failureMessage: 'failure',
                options: waitUntilTestOptions,
            },
        },
    ]);
});
