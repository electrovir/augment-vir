import {assert} from '@augment-vir/assert';
import type {AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import type {EmptyObject} from 'type-fest';
import {
    JsonCompatibleArray,
    JsonCompatibleObject,
    JsonCompatiblePrimitiveValue,
    JsonCompatibleValue,
} from './json-compatible.js';

describe('JsonCompatibleValue', () => {
    it('has proper JsonCompatiblePrimitiveValue types', () => {
        assert
            .tsType<JsonCompatiblePrimitiveValue>()
            .equals<string | number | boolean | null | undefined>();
        assert.tsType<JsonCompatibleObject>().matches<JsonCompatibleValue>();
        assert.tsType<JsonCompatibleValue>().notMatches<JsonCompatibleObject>();
    });

    it('has proper JsonCompatibleObject types', () => {
        function acceptObject(input: JsonCompatibleObject) {}

        const readonlyEmptyObject = {} as const;
        const readonlyFilledObject = {stuff: 'value', nested: ['hi'], what: undefined} as const;

        acceptObject({derp: 'derp'});
        acceptObject({derp: undefined});
        acceptObject({derp: 'derp'} as Readonly<Record<string, string>>);
        acceptObject({} as {derp?: string; foo?: string});
        acceptObject({} as {derp?: string | undefined; foo?: string | undefined});
        acceptObject({derp: 'hi'} as {readonly derp: string | undefined; foo?: string | undefined});
        acceptObject(readonlyEmptyObject);
        acceptObject(readonlyFilledObject);
        acceptObject({0: 'hello'});
        // @ts-expect-error: string is not an object
        acceptObject('derp');
        // @ts-expect-error: array is not an object
        acceptObject([]);
    });

    it('has proper JsonCompatibleArray types', () => {
        function acceptArray(input: JsonCompatibleArray) {}
        acceptArray([] as ReadonlyArray<number>);
        acceptArray([] as number[]);
        acceptArray([] as Array<number>);
        acceptArray([] as Array<AnyObject>);
        acceptArray([] as Array<EmptyObject>);
        acceptArray([] as Array<{derp: string}>);
        acceptArray([] as Array<JsonCompatiblePrimitiveValue>);
        acceptArray([] as Array<JsonCompatibleObject>);
        acceptArray([] as Array<JsonCompatibleArray>);
        // @ts-expect-error: object with number key is not an array
        acceptArray({0: 'hello'});
        // @ts-expect-error: string is not an array
        acceptArray('derp');
        // @ts-expect-error: object is not an array
        acceptArray({derp: 'derp'});
    });
});
