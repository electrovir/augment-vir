import {describe, itCases} from '@augment-vir/test';
import {capitalizeFirstLetter} from './capitalization.js';

describe(capitalizeFirstLetter.name, () => {
    itCases(capitalizeFirstLetter<any>, [
        {
            it: 'should capitalize a normal word',
            input: 'derp',
            expect: 'Derp',
        },
        {
            it: 'should not modify a numeric first letter',
            input: '12345',
            expect: '12345',
        },
        {
            it: 'should return empty string if input is empty',
            input: '',
            expect: '',
        },
    ]);
});
