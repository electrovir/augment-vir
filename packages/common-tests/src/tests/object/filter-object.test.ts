import {assertTypeOf, itCases} from '@augment-vir/chai';
import {randomString} from '@augment-vir/node-js';
import {assert} from 'chai';
import {describe, it} from 'mocha';
import {filterObject, omitObjectKeys, wrapNarrowTypeWithTypeCheck} from '../../../../common/src';
import {pickObjectKeys} from '../../../../common/src/augments/object/filter-object';

describe(filterObject.name, () => {
    const symbolKey = Symbol('symbol-key');

    const testObject = {
        simple: randomString(),
        [symbolKey]: Math.random(),
        anotherKey: randomString(),
        5: randomString(),
        numeric: Math.random(),
    } as const;

    it('should not modify input object', () => {
        const referenceCopy = testObject;
        const originalObject = {...testObject};
        const originalKeys = Object.keys(testObject);
        filterObject(originalKeys, () => false);

        assert.deepStrictEqual(testObject, originalObject);
        assert.deepStrictEqual(Object.keys(testObject), originalKeys);
        assert.strictEqual(referenceCopy, testObject);
    });

    itCases(filterObject, [
        {
            it: 'should not remove keys when filter is always true',
            expect: {
                simple: testObject.simple,
                [symbolKey]: testObject[symbolKey],
                anotherKey: testObject.anotherKey,
                5: testObject[5],
                numeric: testObject.numeric,
            },
            inputs: [
                testObject,
                () => true,
            ],
        },
        {
            it: 'should be able to remove symbol keys',
            expect: {
                simple: testObject.simple,
                anotherKey: testObject.anotherKey,
                5: testObject[5],
                numeric: testObject.numeric,
            },
            inputs: [
                testObject,
                (key) => {
                    return typeof key !== 'symbol';
                },
            ],
        },
        {
            it: 'should be able to filter to ONLY symbol keys',
            expect: {
                [symbolKey]: testObject[symbolKey],
            },
            inputs: [
                testObject,
                (key) => {
                    return typeof key == 'symbol';
                },
            ],
        },
        {
            it: 'should be able to remove by value',
            expect: {
                simple: testObject.simple,
                anotherKey: testObject.anotherKey,
                5: testObject[5],
            },
            inputs: [
                testObject,
                (key, value) => {
                    return typeof value === 'string';
                },
            ],
        },
    ]);
});

describe(omitObjectKeys.name, () => {
    it('should create proper types', () => {
        const exampleObject = {
            five: 'four',
            4: 3,
            somethingElse: 4,
        } as const;
        const keysToRemove = wrapNarrowTypeWithTypeCheck<
            ReadonlyArray<keyof typeof exampleObject>
        >()([
            'five',
            'somethingElse',
        ] as const);

        exampleObject.five;
        exampleObject.somethingElse;

        const output = omitObjectKeys(exampleObject, keysToRemove);

        assertTypeOf(output).toBeAssignableTo<
            Omit<typeof exampleObject, 'five' | 'somethingElse'>
        >();

        // @ts-expect-error
        output.five;
        // @ts-expect-error
        output.somethingElse;
    });

    itCases(
        (...inputs: Parameters<typeof omitObjectKeys<any, any>>) => omitObjectKeys(...inputs),
        [
            {
                it: 'should remove basic keys',
                inputs: [
                    {a: 1, b: 2, c: 3},
                    ['b'],
                ],
                expect: {a: 1, c: 3},
            },
        ],
    );
});

describe(pickObjectKeys.name, () => {
    it('should pick object types', () => {
        const exampleObject = {
            five: 'four',
            4: 3,
            somethingElse: 4,
        } as const;
        const keysToKeep = wrapNarrowTypeWithTypeCheck<ReadonlyArray<keyof typeof exampleObject>>()(
            [
                'five',
                'somethingElse',
            ] as const,
        );

        assertTypeOf(exampleObject[4]).toEqualTypeOf<3>();

        const output = pickObjectKeys(exampleObject, keysToKeep);

        assertTypeOf(output).toBeAssignableTo<
            Pick<typeof exampleObject, 'five' | 'somethingElse'>
        >();

        // @ts-expect-error
        output[4];
    });

    itCases(
        (...inputs: Parameters<typeof pickObjectKeys<any, any>>) => pickObjectKeys(...inputs),
        [
            {
                it: 'should keep basic keys',
                inputs: [
                    {a: 1, b: 2, c: 3},
                    ['b'],
                ],
                expect: {b: 2},
            },
        ],
    );
});
