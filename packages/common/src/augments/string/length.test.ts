import {describe, itCases} from '@augment-vir/test';
import {getByteLength} from './length.js';

describe(getByteLength.name, () => {
    itCases(getByteLength, [
        {
            it: 'works with emoji',
            input: 'hello 🌍',
            expect: 10,
        },
        {
            it: 'works without emoji',
            input: 'hello',
            expect: 5,
        },
    ]);
});
