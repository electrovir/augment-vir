import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {applyBrand, type Branded, type UnwrapBrand} from './branded-type.js';

type MyId = Branded<string, 'my-database-id-type'>;

describe('Branded', () => {
    it('prevents original type assignment', () => {
        // @ts-expect-error: plain string cannot be assigned to a branded string
        const myIdInstance: MyId = 'id-example';
        const myString: string = myIdInstance;
    });
    it('overlaps identical keys', () => {
        type MyId2 = Branded<string, 'my-database-id-type'>;

        // @ts-expect-error: plain string cannot be assigned to a branded string
        const myIdInstance: MyId = 'id-example';
        const myString: MyId2 = myIdInstance;
    });
});

describe('UnwrapBrand', () => {
    it('unwraps original type', () => {
        type UnwrappedId = UnwrapBrand<MyId>;

        assert.tsType<UnwrappedId>().equals<string>();
    });
});

describe(applyBrand.name, () => {
    it('requires original type to match', () => {
        assert.tsType(applyBrand<MyId>('value')).equals<MyId>();

        // @ts-expect-error: blocks non-string inputs
        applyBrand<MyId>(123);
    });
    it('requires original type to match', () => {
        assert.tsType(applyBrand<MyId>('value')).equals<MyId>();

        // @ts-expect-error: blocks non-string inputs
        applyBrand<MyId>(123);
    });
    it('preserves nullish', () => {
        assert
            .tsType(applyBrand<MyId>('value' as string | null | undefined))
            .equals<MyId | null | undefined>();
        assert.tsType(applyBrand<MyId>('value' as string | null)).equals<MyId | null>();
        assert.tsType(applyBrand<MyId>('value' as string | undefined)).equals<MyId | undefined>();
    });

    it('does not insert nullish', () => {
        assert.tsType(applyBrand<MyId>('value')).equals<MyId>();
    });
});
