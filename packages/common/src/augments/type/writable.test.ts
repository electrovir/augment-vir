import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {makeWritable} from './writable.js';

function getExampleReadonlyObject() {
    return {
        a: 'five',
    } as const;
}

function runWriteAccessTests(writeAccessModifier: (input: any) => any) {
    const originalExample = getExampleReadonlyObject();
    const writableExample = writeAccessModifier(originalExample);

    assert.strictEquals(writableExample, originalExample);
    assert.deepEquals(writableExample, originalExample);
}

describe(makeWritable.name, () => {
    it('makes a type writeable', () => {
        assert.tsType(getExampleReadonlyObject()).notEquals<{a: 'five'}>();
        assert.tsType(makeWritable(getExampleReadonlyObject())).equals<{a: 'five'}>();
    });

    it('does not modify the object reference that was made writable', () => {
        runWriteAccessTests(makeWritable);
    });
});
