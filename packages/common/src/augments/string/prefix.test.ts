import {describe, itCases} from '@augment-vir/test';
import {addPrefix, removePrefix} from './prefix.js';

describe(addPrefix.name, () => {
    itCases(addPrefix, [
        {
            it: 'adds a simple prefix',
            input: {
                prefix: 'and ',
                value: 'hello there',
            },
            expect: 'and hello there',
        },
    ]);
});

describe(removePrefix.name, () => {
    itCases(removePrefix, [
        {
            it: 'removes a simple prefix',
            input: {
                prefix: 'and ',
                value: 'and hello there',
            },
            expect: 'hello there',
        },
    ]);
});
