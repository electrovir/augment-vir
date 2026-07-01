/* eslint-disable @typescript-eslint/no-deprecated */

import {describe, itCases} from '@augment-vir/test';
import {capitalizeFirstLetter} from './capitalization.js';

describe(capitalizeFirstLetter.name, () => {
    itCases(capitalizeFirstLetter<any>, [
        {
            it: 'capitalizes a normal word',
            input: 'derp',
            expect: 'Derp',
        },
        {
            it: 'does not modify a numeric first letter',
            input: '12345',
            expect: '12345',
        },
        {
            it: 'returns empty string if input is empty',
            input: '',
            expect: '',
        },
    ]);
});
