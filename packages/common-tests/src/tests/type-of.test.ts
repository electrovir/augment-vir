import {assertTypeOf, itCases} from '@augment-vir/chai';
import {describe, it} from 'mocha';
import {JsonObject, JsonValue} from 'type-fest';
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

    it('should narrow a union', () => {
        const anything = {} as string | object;

        if (isTypeOfWithArray(anything, 'string')) {
            assertTypeOf(anything).toEqualTypeOf('');
        }
    });

    it('should narrow out array types in the object type', () => {
        const anything = {} as JsonValue;

        assertTypeOf<JsonObject>().toMatchTypeOf(anything);
        assertTypeOf(anything).not.toMatchTypeOf<JsonObject>();

        if (isTypeOfWithArray(anything, 'object')) {
            assertTypeOf(anything).toMatchTypeOf<JsonObject>();
        }
    });

    itCases(isTypeOfWithArray, [
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
