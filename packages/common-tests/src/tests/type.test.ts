import {
    ArrayElement,
    DeepWriteable,
    NoInfer,
    RequireNonVoid,
    Tuple,
    Writeable,
    ensureType,
    makeReadonly,
    makeWritable,
    wrapNarrowTypeWithTypeCheck,
} from '@augment-vir/common';
import {assert} from 'chai';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

describe('NoInfer', () => {
    function functionThatHasAGenericForTesting<T = never>(input: NoInfer<T>): T {
        return input;
    }

    it('should force function generics to be provided', () => {
        const randomTestValue = {
            none: 'of this data',
            actually: 'matters at all',
            it: 'is just placeholder data',
        } as const;

        // the ts-expect-error below is the test
        // @ts-expect-error
        functionThatHasAGenericForTesting(randomTestValue);
        functionThatHasAGenericForTesting<typeof randomTestValue>(randomTestValue);
    });
});

describe('RequireNonVoid', () => {
    it('blocks void values', () => {
        assertTypeOf<RequireNonVoid<void, 'success', 'failure'>>().toEqualTypeOf<'failure'>();
        assertTypeOf<RequireNonVoid<void, 'success', 'failure'>>().not.toEqualTypeOf<'success'>();
    });
    it('allows non-void values', () => {
        assertTypeOf<RequireNonVoid<undefined, 'success', 'failure'>>().toEqualTypeOf<'success'>();
        assertTypeOf<RequireNonVoid<undefined, 'success', 'failure'>>().toEqualTypeOf<'success'>();
    });
});

describe(ensureType.name, () => {
    const placeholder = {
        what: 'nothing',
        just: 'make sure no mutations happened',
        inFact: 'the object reference should remain as well',
    } as const;

    it('should not actually mutate or change its input', () => {
        const output = ensureType<typeof placeholder>(placeholder);

        assert.strictEqual(output, placeholder, 'object references should not have changed');
        assert.deepStrictEqual(output, placeholder, 'object internals should not have changed');
    });

    it('should enforce type safety', () => {
        // @ts-expect-error
        ensureType<string>(5);
        ensureType<string>('5');
        // @ts-expect-error
        ensureType<{who: number}>({what: 5});
        ensureType<{who: number}>({who: 5});
        ensureType<{who?: number}>({});
        // @ts-expect-error
        const wrongAssignment: number = ensureType<string>('actually a string');
        const correctAssignment: number = ensureType<number>(5);

        // @ts-expect-error
        const errorIfNoGeneric: unknown = ensureType(placeholder);
    });
});

describe('ArrayElement', () => {
    it('should be able to extract types', () => {
        assertTypeOf<ArrayElement<string[]>>().toEqualTypeOf<string>();
        assertTypeOf<ArrayElement<ReadonlyArray<string>>>().toEqualTypeOf<string>();
    });
});

describe(wrapNarrowTypeWithTypeCheck.name, () => {
    it('should produce strict types', () => {
        const strictTuple = wrapNarrowTypeWithTypeCheck<Readonly<Tuple<string, 5>>>()([
            'a',
            'b',
            'c',
            'd',
            'e',
        ] as const);

        assertTypeOf(strictTuple).toEqualTypeOf([
            'a',
            'b',
            'c',
            'd',
            'e',
        ] as const);
    });
});

describe('Writeable', () => {
    it('should produce correct types', () => {
        type Menu = Readonly<{
            breakfast: Readonly<string[]>;
            lunch: Readonly<string[]>;
            dinner: Readonly<string[]>;
        }>;

        const myMenu: Menu = {
            breakfast: [],
            lunch: [],
            dinner: [],
        };

        // @ts-expect-error
        myMenu.breakfast = [];
        // @ts-expect-error
        myMenu.breakfast.push('egg');

        const myMutableMenu: Writeable<Menu> = {
            breakfast: [],
            lunch: [],
            dinner: [],
        };

        myMutableMenu.breakfast = [];
        // @ts-expect-error
        myMutableMenu.breakfast.push('egg');

        const myDeeplyMutableMenu: DeepWriteable<Menu> = {
            breakfast: [],
            lunch: [],
            dinner: [],
        };

        myDeeplyMutableMenu.breakfast = [];
        myDeeplyMutableMenu.breakfast.push('egg');
    });
});

function getExampleReadonlyObject() {
    const exampleObject = {a: 'five'} as const;
    return exampleObject;
}

function runWriteAccessTests(writeAccessModifier: (input: any) => any) {
    const originalExample = getExampleReadonlyObject();
    const writableExample = writeAccessModifier(originalExample);

    assert.strictEqual(writableExample, originalExample);
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
