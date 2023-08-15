import {itCases} from '@augment-vir/chai';
import {toEnsuredNumber} from '@augment-vir/common';

describe(toEnsuredNumber.name, () => {
    itCases(toEnsuredNumber, [
        {
            it: 'converts a string to a number',
            input: '5',
            expect: 5,
        },
        {
            it: 'errors on invalid number string',
            input: '5-3',
            throws: Error,
        },
        {
            it: 'errors on object input',
            input: {},
            throws: Error,
        },
    ]);
});
