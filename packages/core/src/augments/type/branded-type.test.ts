import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {applyBrand, type Branded, type UnwrapBrand} from './branded-type.js';

describe('Branded', () => {
    it('prevents original type assignment', () => {
        type MyId = Branded<string, 'my-database-id-type'>;

        // @ts-expect-error: plain string cannot be assigned to a branded string
        const myIdInstance: MyId = 'id-example';
        const myString: string = myIdInstance;
    });
    it('overlaps identical keys', () => {
        type MyId1 = Branded<string, 'my-database-id-type'>;
        type MyId2 = Branded<string, 'my-database-id-type'>;

        // @ts-expect-error: plain string cannot be assigned to a branded string
        const myIdInstance: MyId = 'id-example';
        const myString: MyId2 = myIdInstance;
    });
});

describe('UnwrapBrand', () => {
    it('unwraps original type', () => {
        type MyId = Branded<string, 'my-database-id-type'>;

        assert.tsType<UnwrapBrand<MyId>>().equals<string>();
    });
});

describe(applyBrand.name, () => {
    it('requires original type to match', () => {
        type MyId = Branded<string, 'my-database-id-type'>;

        assert.tsType(applyBrand<MyId>('value')).equals<MyId>();

        // @ts-expect-error: blocks non-string inputs
        applyBrand<MyId>(123);
    });
});
