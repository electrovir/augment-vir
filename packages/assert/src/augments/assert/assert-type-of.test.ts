import {describe, it} from '../../test-suite.mock.js';
import {assertTypeOf} from './assert-type-of.js';

describe(assertTypeOf.name, () => {
    it('should correctly type with toBeAssignableTo', () => {
        assertTypeOf<string>().toBeAssignableTo('');
        assertTypeOf('').toBeAssignableTo<string>();
        assertTypeOf('').toBeAssignableTo<string | number>();
        assertTypeOf('').not.toBeAssignableTo<number>();
    });
});
