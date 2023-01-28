import {assertTypeOf} from '@augment-vir/chai';
import {
    JsonCompatibleArray,
    JsonCompatibleObject,
    JsonCompatiblePrimitiveValue,
} from '../../../common/src/augments/json-compatible';

describe('JsonCompatibleValue', () => {
    it('should have proper JsonCompatiblePrimitiveValue types', () => {
        assertTypeOf<JsonCompatiblePrimitiveValue>().toEqualTypeOf<
            string | number | boolean | null | undefined
        >();
    });

    it('should have proper JsonCompatibleObject types', () => {
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
        // @ts-expect-error
        acceptObject('derp');
        // @ts-expect-error
        acceptObject([]);
    });

    it('should have proper JsonCompatibleArray types', () => {
        function acceptArray(input: JsonCompatibleArray) {}
        acceptArray([] as ReadonlyArray<number>);
        acceptArray([] as number[]);
        acceptArray([] as Array<number>);
        acceptArray([] as Array<{}>);
        acceptArray([] as Array<{derp: string}>);
        acceptArray([] as Array<JsonCompatiblePrimitiveValue>);
        acceptArray([] as Array<JsonCompatibleObject>);
        acceptArray([] as Array<JsonCompatibleArray>);
        // @ts-expect-error
        acceptArray({0: 'hello'});
        // @ts-expect-error
        acceptArray('derp');
        // @ts-expect-error
        acceptArray({derp: 'derp'});
    });
});
