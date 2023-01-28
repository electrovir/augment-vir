import {itCases} from '@augment-vir/chai';
import {describe} from 'mocha';
import {jsonify} from '../../../../common/src';
import {JsonCompatibleObject} from '../../../../common/src/augments/json-compatible';

describe(jsonify.name, () => {
    const jsonCompatible: JsonCompatibleObject = {
        a: 5,
        b: 'five',
        c: false,
        d: null,
        e: [
            4,
            'five',
            false,
        ],
    };

    itCases(jsonify, [
        {
            it: 'should work on an empty object',
            input: {},
            expect: {},
        },
        {
            it: 'should work with primitive properties',
            input: jsonCompatible,
            expect: jsonCompatible,
        },
        {
            it: 'will strip out map types',
            input: new Map(),
            expect: {},
        },
        {
            it: 'will convert dates to strings',
            input: new Date(1000),
            expect: '1970-01-01T00:00:01.000Z',
        },
        {
            it: 'will convert RegExp objects to empty objects',
            input: new RegExp('.'),
            expect: {},
        },
    ]);
});
