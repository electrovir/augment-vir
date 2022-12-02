import {assertTypeOf, itCases} from '@augment-vir/testing';
import {assert} from 'chai';
import {describe, it} from 'mocha';
import {isTypeOfWithArray} from '../../../common/src';

describe(isTypeOfWithArray.name, () => {
    it('should narrow a union type', () => {
        const possiblyNumber = 42 as number | number[];

        if (isTypeOfWithArray(possiblyNumber, 'array')) {
            assertTypeOf(possiblyNumber).toEqualTypeOf<number[]>();
        }
    });

    it('should narrow an any type', () => {
        const anything = {} as any;

        if (isTypeOfWithArray(anything, 'bigint')) {
            assertTypeOf(anything).toEqualTypeOf<bigint>();
        }
    });

    itCases({assert, it, forceIt: it.only}, isTypeOfWithArray, [
        {
            it: 'should distinguish array independent of object',
            inputs: [
                [],
                'array',
            ],
            expect: true,
        },
        {
            it: 'should detect a normal object still',
            inputs: [
                {},
                'object',
            ],
            expect: true,
        },
    ]);
});
