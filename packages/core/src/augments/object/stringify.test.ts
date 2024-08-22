import {describe, itCases} from '@augment-vir/test';
import type {AnyObject} from './generic-object-type';
import {stringify} from './stringify';

describe(stringify.name, () => {
    const circular: AnyObject = {
        a: 'b',
    };

    circular.child = circular;

    itCases(stringify, [
        {
            it: 'handles a standard object',
            input: {a: 'b'},
            expect: "{a:'b'}",
        },
        {
            it: 'handles a circular object',
            input: circular,
            expect: '[object Object]',
        },
    ]);
});
