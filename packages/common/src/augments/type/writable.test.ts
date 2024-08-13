import {assert, describe, it} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
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

describe(makeWritable.name, () => {
    it('should make a type writeable', () => {
        assertTypeOf(getExampleReadonlyObject()).not.toEqualTypeOf<{a: 'five'}>();
        assertTypeOf(makeWritable(getExampleReadonlyObject())).toEqualTypeOf<{a: 'five'}>();
    });

    it('should not modify the object reference that was made writable', () => {
        runWriteAccessTests(makeWritable);
    });
});
