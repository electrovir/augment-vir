import {describe} from 'mocha';
import {JsonObject, JsonValue} from 'type-fest';
import {assertTypeOf} from './assert-type-of';

describe(assertTypeOf.name, () => {
    it('should correctly type with toBeAssignableTo', () => {
        assertTypeOf<string>().toBeAssignableTo('');
        assertTypeOf('').toBeAssignableTo<string>();
        assertTypeOf('').toBeAssignableTo<string | number>();
        assertTypeOf('').not.toBeAssignableTo<number>();

        assertTypeOf<JsonObject>().toBeAssignableTo<JsonValue>();
        assertTypeOf<JsonValue>().not.toBeAssignableTo<JsonObject>();
    });
});
