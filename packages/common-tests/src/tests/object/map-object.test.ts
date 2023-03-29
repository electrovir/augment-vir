import {assertTypeOf} from '@augment-vir/chai';
import {
    getObjectTypedKeys,
    mapObjectValues,
    mapObjectValuesSync,
    PropertyValueType,
    waitValue,
} from '@augment-vir/common';
import {randomString} from '@augment-vir/node-js';
import chai, {assert, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {describe, it} from 'mocha';

describe(mapObjectValuesSync.name, () => {
    it('should have proper types', () => {
        assert.notInstanceOf(
            mapObjectValuesSync({thing: 5})(async () => {
                return await waitValue(40, 0);
            }),
            Promise,
        );

        assertTypeOf(
            mapObjectValuesSync({thing: 2})<{thing: number}>((key, value) => {
                return 5;
            }),
        ).toEqualTypeOf<{thing: number}>();
    });

    it('should properly map', () => {
        const startingObject = {
            a: '4',
            b: 52,
            c: /hello there/,
        } as const;

        const mappedObject = mapObjectValuesSync(startingObject)((key, value) => {
            assertTypeOf(key).toEqualTypeOf<keyof typeof startingObject>();
            assertTypeOf(value).toEqualTypeOf<PropertyValueType<typeof startingObject>>();
            return String(value).length;
        });

        assert.deepStrictEqual(mappedObject, {a: 1, b: 2, c: 13});
    });
});

describe(mapObjectValues.name, () => {
    function onlyAcceptNumbers(input: number): void {}
    function onlyAcceptStrings(input: string): void {}

    it("should map an object's values", () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        // type tests
        onlyAcceptNumbers(originalObject.a);
        // @ts-expect-error
        onlyAcceptStrings(originalObject.a);

        const mappedObject = mapObjectValues(originalObject, (key, value) => {
            return String(value);
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;

        expect(getObjectTypedKeys(originalObject)).to.deep.equal(getObjectTypedKeys(mappedObject));

        getObjectTypedKeys(originalObject).forEach((key) => {
            expect(originalObject.hasOwnProperty(key)).to.equal(true);
            expect(mappedObject.hasOwnProperty(key)).to.equal(true);

            expect(Number(mappedObject[key])).to.deep.equal(originalObject[key]);
            expect(String(originalObject[key])).to.deep.equal(mappedObject[key]);
        });
    });

    it('should handle async errors thrown in the callback', async () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        const errorMessage = randomString();

        chai.use(chaiAsPromised);
        await assert.isRejected(
            mapObjectValues(originalObject, async (key, value) => {
                throw new Error(errorMessage);
            }),
            errorMessage,
        );
    });

    it('should work with promises', async () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        const mappedObject = mapObjectValues(originalObject, async (key, value) => {
            return Promise.resolve(String(value));
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        // @ts-expect-error
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;

        const awaitedMappedObject = await mappedObject;

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(awaitedMappedObject.a);
        onlyAcceptStrings(awaitedMappedObject.a);
        // @ts-expect-error
        awaitedMappedObject.q;

        expect(getObjectTypedKeys(originalObject)).to.deep.equal(
            getObjectTypedKeys(awaitedMappedObject),
        );

        getObjectTypedKeys(originalObject).forEach((key) => {
            expect(originalObject.hasOwnProperty(key)).to.equal(true);
            expect(awaitedMappedObject.hasOwnProperty(key)).to.equal(true);

            expect(Number(awaitedMappedObject[key])).to.deep.equal(originalObject[key]);
            expect(String(originalObject[key])).to.deep.equal(awaitedMappedObject[key]);
        });
    });

    it('should preserve properties with complex value types', () => {
        const originalObject = {
            a: 1,
            b: {what: 'two'},
            c: '3',
            d: 4,
            e: 5,
        };

        // type tests
        onlyAcceptNumbers(originalObject.a);
        // @ts-expect-error
        onlyAcceptNumbers(originalObject.b);
        // @ts-expect-error
        onlyAcceptNumbers(originalObject.c);
        // @ts-expect-error
        onlyAcceptStrings(originalObject.a);

        const mappedObject = mapObjectValues(originalObject, (key, value) => {
            return String(value);
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.b);
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.c);
        onlyAcceptStrings(mappedObject.b);
        onlyAcceptStrings(mappedObject.c);
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;
    });
});
