import {itCases} from '@augment-vir/chai';
import {addPrefix, removePrefix} from '@augment-vir/common';

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
