import {describe, itCases} from '@augment-vir/test';
import {type AnyObject} from './generic-object-type.js';
import {stringify} from './stringify.js';

describe(stringify.name, () => {
    const circular: AnyObject = {
        a: 'b',
    };

    circular.child = circular;

    itCases(stringify, [
        {
            it: 'handles a standard object',
            inputs: [
                {a: 'b'},
            ],
            expect: "{a:'b'}",
        },
        {
            it: 'handles a circular object',
            inputs: [
                circular,
            ],
            expect: '[object Object]',
        },
        {
            it: 'handles BigInt',
            inputs: [
                42n,
            ],
            expect: '42',
        },
        {
            it: 'logs undefined',
            inputs: [
                {a: undefined},
            ],
            expect: '{a:undefined}',
        },
        {
            it: 'logs with spaces',
            inputs: [
                {a: undefined},
                4,
            ],
            expect: '{\n    a: undefined,\n}',
        },
    ]);
});
