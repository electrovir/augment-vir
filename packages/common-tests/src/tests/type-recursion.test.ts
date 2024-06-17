import {AnyObject, NestedSequentialKeys} from '@augment-vir/common';

describe('Ts recursion', () => {
    it('allows deep recursion without TS erroring', () => {
        /** If the recursion was too deep, the type below would fail. */
        type TestType<
            MyParam extends AnyObject,
            KeyPath extends NestedSequentialKeys<MyParam>,
        > = NestedSequentialKeys<MyParam>;
    });
});
