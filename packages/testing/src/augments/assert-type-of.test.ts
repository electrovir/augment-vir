import {JsonCompatibleObject, JsonCompatibleValue} from '@augment-vir/common';
import {describe} from 'mocha';
import {assertTypeOf} from './assert-type-of';

describe(assertTypeOf.name, () => {
    it('should correctly type with toBeAssignableTo', () => {
        assertTypeOf<string>().toBeAssignableTo('');
        assertTypeOf('').toBeAssignableTo<string>();
        assertTypeOf('').toBeAssignableTo<string | number>();
        assertTypeOf('').not.toBeAssignableTo<number>();

        assertTypeOf<JsonCompatibleObject>().toBeAssignableTo<JsonCompatibleValue>();
        assertTypeOf<JsonCompatibleValue>().not.toBeAssignableTo<JsonCompatibleObject>();
    });
});
