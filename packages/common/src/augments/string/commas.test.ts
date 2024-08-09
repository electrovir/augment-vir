import {describe, itCases} from '@augment-vir/test';
import {addCommasToNumber, removeCommas} from './commas.js';

describe(addCommasToNumber.name, () => {
    itCases(addCommasToNumber, [
        {
            it: 'adds a comma to a thousand',
            input: 1000,
            expect: '1,000',
        },
        {
            it: 'handles an invalid number',
            input: 'not a number',
            expect: 'NaN',
        },
        {
            it: 'handles string inputs',
            input: '1000000',
            expect: '1,000,000',
        },
        {
            it: 'adds multiple commas',
            input: 1_000_123_123,
            expect: '1,000,123,123',
        },
        {
            it: 'adds commas even when there are decimal points',
            input: 1_000_123.456,
            expect: '1,000,123.456',
        },
        {
            it: 'does not put a comma after the negative',
            input: -100_000,
            expect: '-100,000',
        },
    ]);
});

describe(removeCommas.name, () => {
    itCases(removeCommas, [
        {
            it: 'one comma stripped',
            input: '123,456',
            expect: '123456',
        },
        {
            it: 'multiple commas stripped',
            input: '123,456,789,012',
            expect: '123456789012',
        },
        {
            it: 'no commas stripped',
            input: '1234.56',
            expect: '1234.56',
        },
        {
            it: 'comma stripped with decimal intact',
            input: '1,234.56',
            expect: '1234.56',
        },
    ]);
});
