import type {AnyObject} from '@augment-vir/core';
import {describe, type FunctionTestCase, it, itCases} from '@augment-vir/test';
import {Primitive} from 'type-fest';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isPrimitive', () => {
    const primitives: ReadonlyArray<Primitive> = [
        'string',
        123,
        123n,
        true,
        false,
        undefined,
        Symbol('symbol'),
        null,
    ];

    const nonPrimitives: ReadonlyArray<unknown> = [
        {},
        () => {},
        [],
    ];

    const primitiveTestCases = [
        {
            it: 'accepts a string',
            input: 'hi',
            expect: true,
        },
        {
            it: 'accepts a number',
            input: 0,
            expect: true,
        },
        {
            it: 'accepts a symbol',
            input: Symbol('hello'),
            expect: true,
        },
        {
            it: 'rejects a function',
            input: () => {},
            expect: false,
        },
        {
            it: 'accepts a boolean',
            input: true,
            expect: true,
        },
        {
            it: 'rejects an object',
            input: {},
            expect: false,
        },
        {
            it: 'rejects an array',
            input: [],
            expect: false,
        },
        {
            it: 'accepts a bigint',
            input: 123n,
            expect: true,
        },
        {
            it: 'accepts undefined',
            input: undefined,
            expect: true,
        },
        {
            it: 'accepts null',
            input: null,
            expect: true,
        },
    ] as const satisfies ReadonlyArray<FunctionTestCase<typeof check.isPrimitive>>;

    const actualPass: string | AnyObject = 'one' as any;
    const actualReject: string | AnyObject = {} as any;
    type ExpectedType = string;
    type UnexpectedType = string | AnyObject;

    describe('assert', () => {
        itCases(
            assert.isPrimitive,
            primitiveTestCases.map((testCase): FunctionTestCase<typeof assert.isPrimitive> => {
                const errorMessage = 'some message';
                return {
                    it: testCase.it,
                    inputs: [
                        testCase.input,
                        errorMessage,
                    ],
                    throws: testCase.expect
                        ? undefined
                        : {
                              matchMessage: errorMessage,
                          },
                };
            }),
        );
        it('accepts all primitive types', () => {
            primitives.forEach((primitive, index) => {
                assert.isPrimitive(
                    primitive,
                    `'${String(primitive)}' (index '${index}') should be a primitive`,
                );
            });
        });
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isPrimitive(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isPrimitive(actualReject));
        });
    });
    describe('check', () => {
        itCases(check.isPrimitive, primitiveTestCases);
        it('rejects  non-primitive types', () => {
            nonPrimitives.forEach((nonPrimitive, index) => {
                assert.isFalse(
                    check.isPrimitive(nonPrimitive),
                    `'${String(nonPrimitive)}' (index '${index}') should not be a primitive`,
                );
            });
        });
        it('guards', () => {
            assert.isTrue(check.isPrimitive(actualPass));

            if (check.isPrimitive(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isPrimitive(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isPrimitive(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isPrimitive(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isPrimitive(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isPrimitive(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isPrimitive(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isPrimitive(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isNotPrimitive', () => {
    const primitives: ReadonlyArray<Primitive> = [
        'string',
        123,
        123n,
        true,
        false,
        undefined,
        Symbol('symbol'),
        null,
    ];

    const nonPrimitives: ReadonlyArray<unknown> = [
        {},
        () => {},
        [],
    ];

    const notPrimitiveTestCases = [
        {
            it: 'rejects a string',
            input: 'hi',
            expect: false,
        },
        {
            it: 'rejects a number',
            input: 0,
            expect: false,
        },
        {
            it: 'rejects a symbol',
            input: Symbol('hello'),
            expect: false,
        },
        {
            it: 'accepts a function',
            input: () => {},
            expect: true,
        },
        {
            it: 'rejects a boolean',
            input: true,
            expect: false,
        },
        {
            it: 'accepts an object',
            input: {},
            expect: true,
        },
        {
            it: 'accepts an array',
            input: [],
            expect: true,
        },
        {
            it: 'rejects a bigint',
            input: 123n,
            expect: false,
        },
        {
            it: 'rejects undefined',
            input: undefined,
            expect: false,
        },
        {
            it: 'rejects null',
            input: null,
            expect: false,
        },
    ] as const satisfies ReadonlyArray<FunctionTestCase<typeof check.isNotPrimitive>>;

    const actualPass: string | AnyObject = {} as any;
    const actualReject: string | AnyObject = 'hi' as any;
    type ExpectedType = AnyObject;
    type UnexpectedType = string | AnyObject;

    describe('assert', () => {
        itCases(
            assert.isNotPrimitive,
            notPrimitiveTestCases.map(
                (testCase): FunctionTestCase<typeof assert.isNotPrimitive> => {
                    const errorMessage = 'some message';
                    return {
                        it: testCase.it,
                        inputs: [
                            testCase.input,
                            errorMessage,
                        ],
                        throws: {
                            matchMessage: testCase.expect ? undefined : errorMessage,
                        },
                    };
                },
            ),
        );
        it('rejects all primitive types', () => {
            primitives.forEach((primitive, index) => {
                assert.throws(() =>
                    assert.isNotPrimitive(
                        primitive,
                        `'${String(primitive)}' (index '${index}') should be a primitive`,
                    ),
                );
            });
        });
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotPrimitive(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotPrimitive(actualReject));
        });
    });
    describe('check', () => {
        itCases(check.isNotPrimitive, notPrimitiveTestCases);
        it('accepts non-primitive types', () => {
            nonPrimitives.forEach((nonPrimitive, index) => {
                assert.isTrue(
                    check.isNotPrimitive(nonPrimitive),
                    `'${String(nonPrimitive)}' (index '${index}') should not be a primitive`,
                );
            });
        });
        it('guards', () => {
            assert.isTrue(check.isNotPrimitive(actualPass));

            if (check.isNotPrimitive(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotPrimitive(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotPrimitive(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotPrimitive(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotPrimitive(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotPrimitive(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotPrimitive(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotPrimitive(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('isPropertyKey', () => {
    const actualPass: string | boolean = 'one' as any;
    const actualReject: string | boolean = true as any;
    type ExpectedType = string;
    type UnexpectedType = boolean;

    const propertyKeyTestCases = [
        {
            it: 'accepts a string',
            input: 'hi',
            expect: true,
        },
        {
            it: 'accepts a number',
            input: 0,
            expect: true,
        },
        {
            it: 'accepts a symbol',
            input: Symbol('hello'),
            expect: true,
        },
        {
            it: 'rejects a function',
            input: () => {},
            expect: false,
        },
        {
            it: 'rejects a boolean',
            input: true,
            expect: false,
        },
        {
            it: 'rejects an object',
            input: {},
            expect: false,
        },
        {
            it: 'rejects an array',
            input: [],
            expect: false,
        },
        {
            it: 'rejects a bigint',
            input: 123n,
            expect: false,
        },
        {
            it: 'rejects undefined',
            input: undefined,
            expect: false,
        },
        {
            it: 'rejects null',
            input: null,
            expect: false,
        },
    ] as const satisfies ReadonlyArray<FunctionTestCase<typeof check.isPropertyKey>>;

    describe('assert', () => {
        itCases(
            assert.isPropertyKey,
            propertyKeyTestCases.map((testCase): FunctionTestCase<typeof assert.isPropertyKey> => {
                const errorMessage = 'some message';
                return {
                    it: testCase.it,
                    inputs: [
                        testCase.input,
                        errorMessage,
                    ],
                    throws: {
                        matchMessage: testCase.expect ? undefined : errorMessage,
                    },
                };
            }),
        );
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isPropertyKey(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isPropertyKey(actualReject));
        });
    });
    describe('check', () => {
        itCases(check.isPropertyKey, propertyKeyTestCases);
        it('guards', () => {
            assert.isTrue(check.isPropertyKey(actualPass));

            if (check.isPropertyKey(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isPropertyKey(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isPropertyKey(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isPropertyKey(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isPropertyKey(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isPropertyKey(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isPropertyKey(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isPropertyKey(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isNotPropertyKey', () => {
    const actualPass: string | boolean = true as any;
    const actualReject: string | boolean = 'hi' as any;
    type ExpectedType = boolean;
    type UnexpectedType = string;

    const propertyKeyTestCases = [
        {
            it: 'rejects a string',
            input: 'hi',
            expect: false,
        },
        {
            it: 'rejects a number',
            input: 0,
            expect: false,
        },
        {
            it: 'rejects a symbol',
            input: Symbol('hello'),
            expect: false,
        },
        {
            it: 'accepts a function',
            input: () => {},
            expect: true,
        },
        {
            it: 'accepts a boolean',
            input: true,
            expect: true,
        },
        {
            it: 'accepts an object',
            input: {},
            expect: true,
        },
        {
            it: 'accepts an array',
            input: [],
            expect: true,
        },
        {
            it: 'accepts a bigint',
            input: 123n,
            expect: true,
        },
        {
            it: 'accepts undefined',
            input: undefined,
            expect: true,
        },
        {
            it: 'accepts null',
            input: null,
            expect: true,
        },
    ] as const satisfies ReadonlyArray<FunctionTestCase<typeof check.isNotPropertyKey>>;

    describe('assert', () => {
        itCases(
            assert.isNotPropertyKey,
            propertyKeyTestCases.map(
                (testCase): FunctionTestCase<typeof assert.isNotPropertyKey> => {
                    const errorMessage = 'some message';
                    return {
                        it: testCase.it,
                        inputs: [
                            testCase.input,
                            errorMessage,
                        ],
                        throws: {
                            matchMessage: testCase.expect ? undefined : errorMessage,
                        },
                    };
                },
            ),
        );
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotPropertyKey(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotPropertyKey(actualReject));
        });
    });
    describe('check', () => {
        itCases(check.isNotPropertyKey, propertyKeyTestCases);
        it('guards', () => {
            assert.isTrue(check.isNotPropertyKey(actualPass));

            if (check.isNotPropertyKey(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotPropertyKey(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotPropertyKey(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotPropertyKey(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotPropertyKey(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotPropertyKey(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotPropertyKey(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotPropertyKey(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
