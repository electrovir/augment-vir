import {
    ArrayElement,
    DeepWriteable,
    ensureType,
    Equal,
    ExpectTrue,
    NoInfer,
    Tuple,
    wrapNarrowTypeWithTypeCheck,
    Writeable,
} from '@augment-vir/common';
import {assert} from 'chai';
import {describe, it} from 'mocha';

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
        // @ts-expect-error
        const wrongAssignment: number = ensureType<string>('actually a string');
        const correctAssignment: number = ensureType<number>(5);

        // @ts-expect-error
        const errorIfNoGeneric: unknown = ensureType(placeholder);
    });
});

describe('ArrayElement', () => {
    it('should be able to extract types', () => {
        type simpleExtract = ExpectTrue<Equal<ArrayElement<string[]>, string>>;
        type withReadonly = ExpectTrue<Equal<ArrayElement<ReadonlyArray<string>>, string>>;
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

        type shouldBeStrict = ExpectTrue<
            Equal<typeof strictTuple, readonly ['a', 'b', 'c', 'd', 'e']>
        >;
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
