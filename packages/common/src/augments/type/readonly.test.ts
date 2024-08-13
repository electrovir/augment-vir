import {assert, describe, it} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {makeReadonly} from './readonly.js';
import {makeWritable} from './writable.js';

function getExampleReadonlyObject() {
    return {a: 'five'} as const;
}

function runWriteAccessTests(writeAccessModifier: (input: any) => any) {
    const originalExample = getExampleReadonlyObject();
    const writableExample = writeAccessModifier(originalExample);

    assert.areStrictEqual(writableExample, originalExample);
    assert.deepStrictEqual(writableExample, originalExample);
}

describe(makeReadonly.name, () => {
    function getExampleWritableObject() {
        return makeWritable(getExampleReadonlyObject());
    }

    it('should make a type readonly', () => {
        assertTypeOf(getExampleWritableObject()).toEqualTypeOf<{a: 'five'}>();
        assertTypeOf(makeReadonly(getExampleWritableObject())).not.toEqualTypeOf<{a: 'five'}>();
        assertTypeOf(makeReadonly(getExampleWritableObject())).toEqualTypeOf<
            Readonly<{a: 'five'}>
        >();
    });

    it('should not modify the object reference that was made readonly', () => {
        runWriteAccessTests(makeReadonly);
    });
});
