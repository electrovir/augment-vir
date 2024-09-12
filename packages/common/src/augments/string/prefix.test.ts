import {describe, itCases} from '@augment-vir/test';
import {addPrefix, removePrefix} from './prefix.js';

describe(addPrefix.name, () => {
    itCases(addPrefix, [
        {
            it: 'adds a simple prefix',
            input: {
                value: 'hello there',
                prefix: 'and ',
            },
            expect: 'and hello there',
        },
        {
            it: 'does not add existing prefix',
            input: {
                value: 'pre post',
                prefix: 'pre',
            },
            expect: 'pre post',
        },
    ]);
});

describe(removePrefix.name, () => {
    itCases(removePrefix, [
        {
            it: 'removes a simple prefix',
            input: {
                value: 'and hello there',
                prefix: 'and ',
            },
            expect: 'hello there',
        },
        {
            it: 'does nothing for missing prefix',
            input: {
                value: 'pre post',
                prefix: 'something',
            },
            expect: 'pre post',
        },
    ]);
});
