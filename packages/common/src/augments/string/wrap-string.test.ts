import {describe, itCases} from '@augment-vir/test';
import {wrapString} from './wrap-string.js';

describe(wrapString.name, () => {
    itCases(wrapString, [
        {
            it: 'wraps a string',
            input: {
                value: 'hi',
                wrapper: '"',
            },
            expect: '"hi"',
        },
    ]);
});
