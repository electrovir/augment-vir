import {itCases} from '@augment-vir/chai';
import {assertMatchesObjectShape, ObjectWithAtLeastSingleEntryArrays} from '@augment-vir/common';
import {describe, it} from 'mocha';

describe('ObjectWithAtLeastSingleEntryArrays', () => {
    it('should require all arrays to have at least one entry', () => {
        const randomThing = {
            what: 5,
            nested: {
                subArray: [] as string[],
            },
            topArray: [] as number[],
        };

        const shouldAllowAssignment: ObjectWithAtLeastSingleEntryArrays<typeof randomThing> = {
            what: 5,
            nested: {
                subArray: ['yo'],
            },
            topArray: [5],
        };

        const invalidAssignment: ObjectWithAtLeastSingleEntryArrays<typeof randomThing> = {
            what: 5,
            nested: {
                // @ts-expect-error
                subArray: [],
            },
            // @ts-expect-error
            topArray: [],
        };
    });
});

describe(assertMatchesObjectShape.name, () => {
    it('should require a generic to be provided', () => {
        // @ts-expect-error
        assertMatchesObjectShape({}, {});
        assertMatchesObjectShape<{}>({}, {});
    });

    it('should require array properties to have at least one entry', () => {
        type WithArrayProp = {
            five: number;
            arrayProp: string[];
        };
        const shouldNormallyBeAllowedWithoutEntries: WithArrayProp = {
            five: 3,
            arrayProp: [],
        };

        assertMatchesObjectShape<WithArrayProp>(shouldNormallyBeAllowedWithoutEntries, {
            five: 3,
            // @ts-expect-error
            arrayProp: [],
        });
        assertMatchesObjectShape<WithArrayProp>(shouldNormallyBeAllowedWithoutEntries, {
            five: 3,
            arrayProp: ['hello'],
        });
        assertMatchesObjectShape<WithArrayProp>(shouldNormallyBeAllowedWithoutEntries, {
            five: 3,

            arrayProp: [
                // @ts-expect-error
                4,
            ],
        });
    });

    it('should ignore inner keys', () => {
        assertMatchesObjectShape<{derp: {thing: number}}>(
            {
                derp: {
                    thing: 'wrong value' as any,
                },
            },
            {
                derp: {
                    thing: 5,
                },
            },
            false,
            {
                derp: {
                    thing: true,
                },
            },
        );
    });

    itCases(assertMatchesObjectShape<any>, [
        {
            it: 'should match with unequal values',
            inputs: [
                {
                    a: 'derp',
                    b: 0,
                },
                {
                    a: '',
                    b: Infinity,
                },
            ],
            throws: undefined,
        },
        {
            it: 'should be okay with array props that are empty',
            inputs: [
                {
                    a: 'derp',
                    b: [],
                },
                {
                    a: '',
                    b: ['a'],
                },
            ],
            throws: undefined,
        },
        {
            it: 'should pass on valid array values',
            inputs: [
                {
                    a: 'derp',
                    b: ['a'],
                },
                {
                    a: '',
                    b: ['a'],
                },
            ],
            throws: undefined,
        },
        {
            it: 'should fail on invalid array values',
            inputs: [
                {
                    a: 'derp',
                    b: [
                        '2',
                        4,
                    ],
                },
                {
                    a: '',
                    b: ['a'],
                },
            ],
            throws: 'entry at index "1" did not match any of the possible types from "a"',
        },
        {
            it: 'should check against all possible array types',
            inputs: [
                {
                    a: 'derp',
                    b: [
                        '2',
                        4,
                    ],
                },
                {
                    a: '',
                    b: [
                        'a',
                        4,
                    ],
                },
            ],
            throws: undefined,
        },
        {
            it: 'should not match with mismatched types',
            inputs: [
                {
                    a: 42,
                    b: 0,
                },
                {
                    a: '',
                    b: Infinity,
                },
            ],
            throws: 'test object value at key "a" did not match expected shape: type "number" did not match expected type "string"',
        },
        {
            it: 'should not match with an extra property',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: 52,
                },
                {
                    a: 99,
                    b: Infinity,
                },
            ],
            throws: 'Test object has extra keys: c',
        },
        {
            it: 'should match with an extra property when its allowed',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: 52,
                },
                {
                    a: 99,
                    b: Infinity,
                },
                true,
            ],
            throws: undefined,
        },
        {
            it: 'should match with nested properties',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: {
                        nested: {
                            five: 4,
                        },
                    },
                },
                {
                    a: 99,
                    b: Infinity,
                    c: {
                        nested: {
                            five: Infinity,
                        },
                    },
                },
            ],
            throws: undefined,
        },
        {
            it: 'should not match with invalid nested properties',
            inputs: [
                {
                    a: 42,
                    b: 0,
                    c: {
                        nested: {
                            five: 4,
                        },
                    },
                },
                {
                    a: 99,
                    b: Infinity,
                    c: {
                        nested: {
                            five: Infinity,
                            six: 7,
                        },
                    },
                },
            ],
            throws: 'test object does not have key "six" from expected shape.',
        },
    ]);
});
