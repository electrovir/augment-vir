import {assert, describe, it} from '@augment-vir/test';
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
        assert.tsType(getExampleWritableObject()).equals<{a: 'five'}>();
        assert.tsType(makeReadonly(getExampleWritableObject())).notEquals<{a: 'five'}>();
        assert.tsType(makeReadonly(getExampleWritableObject())).equals<Readonly<{a: 'five'}>>();
    });

    it('should not modify the object reference that was made readonly', () => {
        runWriteAccessTests(makeReadonly);
    });
});
