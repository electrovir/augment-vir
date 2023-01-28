import {assertTypeOf, itCases} from '@augment-vir/chai';
import {assert} from 'chai';
import {describe, it} from 'mocha';
import {isRuntimeTypeOf} from '../../../common/src';
import {
    JsonCompatibleObject,
    JsonCompatibleValue,
} from '../../../common/src/augments/json-compatible';
import {assertRuntimeTypeOf} from '../../../common/src/augments/runtime-type-of';

describe(isRuntimeTypeOf.name, () => {
    it('should narrow a union type', () => {
        const possiblyNumber = 42 as number | number[];

        if (isRuntimeTypeOf(possiblyNumber, 'array')) {
            assertTypeOf(possiblyNumber).toEqualTypeOf<number[]>();
        }
    });

    it('should narrow an any type', () => {
        const anything = {} as any;

        if (isRuntimeTypeOf(anything, 'bigint')) {
            assertTypeOf(anything).toEqualTypeOf<bigint>();
        }
    });

    it('should narrow a union', () => {
        const anything = {} as string | object;

        if (isRuntimeTypeOf(anything, 'string')) {
            assertTypeOf(anything).toEqualTypeOf('');
        }
    });

    it('should narrow out array types in the object type', () => {
        const anything = {} as JsonCompatibleValue;

        assertTypeOf<JsonCompatibleObject>().toMatchTypeOf(anything);
        assertTypeOf(anything).not.toMatchTypeOf<JsonCompatibleObject>();

        if (isRuntimeTypeOf(anything, 'object')) {
            assertTypeOf(anything).toMatchTypeOf<JsonCompatibleObject>();
        }
    });

    itCases(isRuntimeTypeOf, [
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

describe(assertRuntimeTypeOf.name, () => {
    it('should narrow types', () => {
        const example = 'test thing' as unknown;

        assertTypeOf(example).not.toEqualTypeOf<string>();
        assertRuntimeTypeOf(example, 'string', 'example');
        assertTypeOf(example).toEqualTypeOf<string>();
    });

    it('should throw an error if the assertion fails', () => {
        assert.throws(() => assertRuntimeTypeOf([], 'string', 'empty array'), TypeError);
    });
});
